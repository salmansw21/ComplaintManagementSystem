package com.example.complaintmanagement.controller;

import com.example.complaintmanagement.dto.*;
import com.example.complaintmanagement.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	final AuthService s;

	public AuthController(AuthService s) {
		this.s = s;
	}

	@PostMapping("/register")
	public AuthDtos.AuthResponse register(@Valid @RequestBody AuthDtos.RegisterRequest r) {
		return s.register(r);
	}

	@PostMapping("/login")
	public AuthDtos.AuthResponse login(@Valid @RequestBody AuthDtos.LoginRequest r) {
		return s.login(r);
	}

	@GetMapping("/me")
	public UserDtos.UserResponse me() {
		return s.me();
	}
}