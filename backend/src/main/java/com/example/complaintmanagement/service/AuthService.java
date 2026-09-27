package com.example.complaintmanagement.service;

import com.example.complaintmanagement.dto.*;

public interface AuthService {
	AuthDtos.AuthResponse register(AuthDtos.RegisterRequest r);

	AuthDtos.AuthResponse login(AuthDtos.LoginRequest r);

	UserDtos.UserResponse me();
}