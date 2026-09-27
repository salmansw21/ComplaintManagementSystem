package com.example.complaintmanagement.controller;

import com.example.complaintmanagement.dto.ComplaintDtos.*;
import com.example.complaintmanagement.entity.*;
import com.example.complaintmanagement.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {
	final ComplaintService s;

	public ComplaintController(ComplaintService s) {
		this.s = s;
	}

	@GetMapping
	public List<Response> list(@RequestParam(required = false) String q,
			@RequestParam(required = false) ComplaintStatus status, @RequestParam(required = false) Priority priority,
			@RequestParam(required = false) Long categoryId) {
		return s.list(q, status, priority, categoryId);
	}

	@GetMapping("/{id}")
	public Response get(@PathVariable Long id) {
		return s.get(id);
	}

	@PostMapping("/")
	public ResponseEntity<Response> create(@Valid @RequestBody CreateRequest r) {
		return ResponseEntity.status(201).body(s.create(r));
	}

	@PutMapping("/{id}")
	public Response update(@PathVariable Long id, @Valid @RequestBody UpdateRequest r) {
		return s.update(id, r);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		s.delete(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/{id}/status")
	public Response status(@PathVariable Long id, @Valid @RequestBody StatusRequest r) {
		return s.status(id, r);
	}

	@PutMapping("/{id}/assign")
	public Response assign(@PathVariable Long id, @Valid @RequestBody AssignRequest r) {
		return s.assign(id, r);
	}

	@GetMapping("/{id}/comments")
	public List<CommentResponse> comments(@PathVariable Long id) {
		return s.comments(id);
	}

	@PostMapping("/{id}/comments")
	public ResponseEntity<CommentResponse> comment(@PathVariable Long id, @Valid @RequestBody CommentRequest r) {
		return ResponseEntity.status(201).body(s.addComment(id, r));
	}

	@GetMapping("/{id}/activities")
	public List<ActivityResponse> activities(@PathVariable Long id) {
		return s.activities(id);
	}
}