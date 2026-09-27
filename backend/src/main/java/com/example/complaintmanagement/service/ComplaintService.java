package com.example.complaintmanagement.service;

import com.example.complaintmanagement.dto.ComplaintDtos.*;
import com.example.complaintmanagement.dto.DashboardDtos;
import com.example.complaintmanagement.entity.*;
import java.util.*;

public interface ComplaintService {
	List<Response> list(String q, ComplaintStatus s, Priority p, Long categoryId);

	List<Response> mine();

	List<Response> assigned();

	Response get(Long id);

	Response create(CreateRequest r);

	Response update(Long id, UpdateRequest r);

	void delete(Long id);

	Response status(Long id, StatusRequest r);

	Response assign(Long id, AssignRequest r);

	List<CommentResponse> comments(Long id);

	CommentResponse addComment(Long id, CommentRequest r);

	List<ActivityResponse> activities(Long id);

	DashboardDtos.Dashboard dashboard();
}