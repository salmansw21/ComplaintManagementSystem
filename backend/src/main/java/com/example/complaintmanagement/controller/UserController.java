package com.example.complaintmanagement.controller;

import com.example.complaintmanagement.dto.UserDtos.*;
import com.example.complaintmanagement.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
	final UserService s;

	public UserController(UserService s) {
		this.s = s;
	}

	@GetMapping
	public List<UserResponse> all() {
		return s.all();
	}

	@GetMapping("/{id}")
	public UserResponse get(@PathVariable Long id) {
		return s.get(id);
	}

	@PostMapping
	public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateRequest r) {
		return ResponseEntity.status(201).body(s.create(r));
	}

	@PutMapping("/{id}")
	public UserResponse update(@PathVariable Long id, @Valid @RequestBody UpdateRequest r) {
		return s.update(id, r);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		s.delete(id);
		return ResponseEntity.noContent().build();
	}
}