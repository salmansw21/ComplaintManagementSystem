package com.example.complaintmanagement.service.impl;

import com.example.complaintmanagement.dto.*;
import com.example.complaintmanagement.dto.ComplaintDtos.*;
import com.example.complaintmanagement.entity.*;
import com.example.complaintmanagement.exception.*;
import com.example.complaintmanagement.mapper.*;
import com.example.complaintmanagement.repository.*;
import com.example.complaintmanagement.service.*;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.*;

@Service
public class ComplaintServiceImpl implements ComplaintService {
	final ComplaintRepository cr;
	final CategoryRepository cat;
	final UserRepository ur;
	final CommentRepository cor;
	final ComplaintActivityRepository ar;
	final CurrentUserService cu;
	final ComplaintMapper cm = new ComplaintMapper();
	final CommentMapper comm = new CommentMapper();

	public ComplaintServiceImpl(ComplaintRepository c, CategoryRepository ca, UserRepository u, CommentRepository co,
			ComplaintActivityRepository a, CurrentUserService cu) {
		cr = c;
		cat = ca;
		ur = u;
		cor = co;
		ar = a;
		this.cu = cu;
	}

	private void check(Complaint c) {
		User u = cu.get();
		if (u.getRole() == Role.ADMIN)
			return;
		if (u.getRole() == Role.SUPPORT) {
			if (c.getAssignedTo() == null || !c.getAssignedTo().getId().equals(u.getId()))
				throw new org.springframework.security.access.AccessDeniedException(
						"You are not authorized to access this complaint");
		} else if (!c.getCreatedBy().getId().equals(u.getId()))
			throw new org.springframework.security.access.AccessDeniedException(
					"You are not authorized to access this complaint");
	}

	public List<Response> list(String q, ComplaintStatus s, Priority p, Long catId) {
		User u = cu.get();
		List<Complaint> xs = (u.getRole() == Role.ADMIN ? cr.search(q, s, p, catId)
				: u.getRole() == Role.SUPPORT ? cr.findByAssignedToIdOrderByCreatedAtDesc(u.getId())
						: cr.findByCreatedByIdOrderByCreatedAtDesc(u.getId()));
		return xs.stream().filter(x -> s == null || x.getStatus() == s).filter(x -> p == null || x.getPriority() == p)
				.filter(x -> catId == null || x.getCategory().getId().equals(catId))
				.filter(x -> q == null || q.isBlank() || x.getComplaintNumber().toLowerCase().contains(q.toLowerCase())
						|| x.getTitle().toLowerCase().contains(q.toLowerCase())
						|| x.getCreatedBy().getUsername().toLowerCase().contains(q.toLowerCase()))
				.map(cm::toResponse).toList();
	}

	public List<Response> mine() {
		return list(null, null, null, null);
	}

	public List<Response> assigned() {
		return list(null, null, null, null);
	}

	public Response get(Long id) {
		Complaint c = cr.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
		check(c);
		return cm.toResponse(c);
	}

	private String number() {
		return String.format("CMP-%d-%06d", Year.now().getValue(), cr.count() + 1);
	}

	public Response create(CreateRequest x) {
		User u = cu.get();
		Category c = cat.findById(x.categoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));
		if (!c.isActive())
			throw new BadRequestException("Category is inactive");
		LocalDateTime now = LocalDateTime.now();
		Complaint cpt = Complaint.builder().complaintNumber(number()).title(x.title()).description(x.description())
				.category(c).createdBy(u).priority(x.priority()).status(ComplaintStatus.SUBMITTED).createdAt(now)
				.updatedAt(now).build();
		cr.save(cpt);
		activity(cpt, u, ActivityType.CREATED, "Complaint created");
		return cm.toResponse(cpt);
	}

	public Response update(Long id, UpdateRequest x) {
		Complaint c = cr.findById(id).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
		check(c);
		if (c.getStatus() != ComplaintStatus.SUBMITTED && c.getStatus() != ComplaintStatus.REOPENED)
			throw new BadRequestException("Only submitted or reopened complaints can be edited");
		c.setTitle(x.title());
		c.setDescription(x.description());
		c.setCategory(cat.findById(x.categoryId()).orElseThrow());
		c.setPriority(x.priority());
		c.setUpdatedAt(LocalDateTime.now());
		cr.save(c);
		activity(c, cu.get(), ActivityType.UPDATED, "Complaint details updated");
		return cm.toResponse(c);
	}

	public void delete(Long id) {
		Complaint c = cr.findById(id).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
		check(c);
		if (c.getStatus() != ComplaintStatus.SUBMITTED)
			throw new BadRequestException("Only submitted complaints can be deleted");
		cr.delete(c);
	}

	public Response status(Long id, StatusRequest x) {
		Complaint c = cr.findById(id).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
		User u = cu.get();
		if (u.getRole() == Role.USER
				&& !(x.status() == ComplaintStatus.CLOSED || x.status() == ComplaintStatus.REOPENED))
			throw new org.springframework.security.access.AccessDeniedException("Users cannot set this status");
		check(c);
		ComplaintStatus old = c.getStatus();
		c.setStatus(x.status());
		c.setResolutionNote(x.resolutionNote());
		c.setUpdatedAt(LocalDateTime.now());
		if (x.status() == ComplaintStatus.RESOLVED)
			c.setResolvedAt(LocalDateTime.now());
		if (x.status() == ComplaintStatus.CLOSED)
			c.setClosedAt(LocalDateTime.now());
		if (x.status() == ComplaintStatus.REOPENED) {
			c.setClosedAt(null);
			c.setResolvedAt(null);
		}
		cr.save(c);
		ActivityType at = x.status() == ComplaintStatus.RESOLVED ? ActivityType.RESOLVED
				: x.status() == ComplaintStatus.REOPENED ? ActivityType.REOPENED
						: x.status() == ComplaintStatus.CLOSED ? ActivityType.CLOSED : ActivityType.STATUS_CHANGED;
		activity(c, u, at, "Status changed from " + old + " to " + x.status());
		return cm.toResponse(c);
	}

	public Response assign(Long id, AssignRequest x) {
		if (cu.get().getRole() != Role.ADMIN)
			throw new org.springframework.security.access.AccessDeniedException(
					"Only administrators can assign complaints");
		Complaint c = cr.findById(id).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
		User support = ur.findById(x.supportUserId())
				.orElseThrow(() -> new ResourceNotFoundException("Support user not found"));
		if (support.getRole() != Role.SUPPORT)
			throw new BadRequestException("Selected user is not support staff");
		c.setAssignedTo(support);
		c.setStatus(ComplaintStatus.ASSIGNED);
		c.setUpdatedAt(LocalDateTime.now());
		cr.save(c);
		activity(c, cu.get(), ActivityType.ASSIGNED, "Complaint assigned to " + support.getUsername());
		return cm.toResponse(c);
	}

	public List<CommentResponse> comments(Long id) {
		Complaint c = cr.findById(id).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
		check(c);
		return cor.findByComplaintIdOrderByCreatedAtAsc(id).stream().map(comm::toResponse).toList();
	}

	public CommentResponse addComment(Long id, CommentRequest x) {
		Complaint c = cr.findById(id).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
		check(c);
		Comment co = cor.save(Comment.builder().complaint(c).user(cu.get()).message(x.message())
				.createdAt(LocalDateTime.now()).build());
		activity(c, cu.get(), ActivityType.COMMENT_ADDED, "Comment added");
		return comm.toResponse(co);
	}

	public List<ActivityResponse> activities(Long id) {
		Complaint c = cr.findById(id).orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
		check(c);
		return ar.findByComplaintIdOrderByCreatedAtAsc(id).stream().map(comm::activity).toList();
	}

	private void activity(Complaint c, User u, ActivityType t, String d) {
		ar.save(ComplaintActivity.builder().complaint(c).performedBy(u).activityType(t).description(d)
				.createdAt(LocalDateTime.now()).build());
	}

	public DashboardDtos.Dashboard dashboard() {
		List<Complaint> all = cr.findAll();
		DashboardDtos.Stats s = new DashboardDtos.Stats(all.size(), cr.countByStatus(ComplaintStatus.SUBMITTED),
				cr.countByStatus(ComplaintStatus.UNDER_REVIEW), cr.countByStatus(ComplaintStatus.ASSIGNED),
				cr.countByStatus(ComplaintStatus.IN_PROGRESS), cr.countByStatus(ComplaintStatus.RESOLVED),
				cr.countByStatus(ComplaintStatus.CLOSED), cr.countByStatus(ComplaintStatus.REOPENED),
				cr.countByPriority(Priority.URGENT), ur.countByActiveTrue(), ur.countByRole(Role.SUPPORT));
		Map<String, Long> catm = new LinkedHashMap<>(), stm = new LinkedHashMap<>(), pm = new LinkedHashMap<>();
		for (Complaint x : all) {
			catm.merge(x.getCategory().getName(), 1L, Long::sum);
			stm.merge(x.getStatus().name(), 1L, Long::sum);
			pm.merge(x.getPriority().name(), 1L, Long::sum);
		}
		return new DashboardDtos.Dashboard(s,
				cr.findTop10ByOrderByCreatedAtDesc().stream().map(cm::toResponse).toList(),
				ur.findTop5ByOrderByCreatedAtDesc().stream().map(new UserMapper()::toResponse).toList(), catm, stm, pm);
	}
}
