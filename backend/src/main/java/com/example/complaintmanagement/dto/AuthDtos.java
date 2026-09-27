package com.example.complaintmanagement.dto;

import jakarta.validation.constraints.*;

import com.example.complaintmanagement.dto.UserDtos.UserResponse;

public class AuthDtos {
	public record RegisterRequest(@NotBlank String firstName, @NotBlank String lastName,
			@NotBlank @Size(min = 4, max = 30) String username, @NotBlank @Email String email,
			@NotBlank @Size(min = 6) String password) {
	}

	public record LoginRequest(@NotBlank String username, @NotBlank String password) {
	}

	public record AuthResponse(String token, UserResponse user) {
	}
}
