package com.example.complaintmanagement.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.util.*;

import javax.crypto.SecretKey;

@Service
public class JwtService {
	private final SecretKey key;
	private final long exp;

	public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-ms}") long exp) {
		key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		this.exp = exp;
	}

	public String generate(Long id, String username, String role) {
		return Jwts.builder().subject(username).claim("id", id).claim("role", role).issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + exp)).signWith(key).compact();
	}

	public String username(String token) {
		return parse(token).getPayload().getSubject();
	}

	public boolean valid(String token) {
		try {
			parse(token);
			return true;
		} catch (JwtException | IllegalArgumentException e) {
			return false;
		}
	}

	private Jws<Claims> parse(String token) {
		return Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
	}
}
