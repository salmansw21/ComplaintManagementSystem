package com.example.complaintmanagement.config;

import com.example.complaintmanagement.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.web.cors.*;
import java.util.*;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	SecurityFilterChain filter(HttpSecurity h, JwtAuthenticationFilter f) throws Exception {
		return h.csrf(c -> c.disable()).cors(c -> c.configurationSource(cors()))
				.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(a -> a.requestMatchers("/api/auth/**", "/error").permitAll()
						.requestMatchers("/api/admin/**", "/api/users/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
						.requestMatchers("/api/categories/**").hasAnyRole("ADMIN", "SUPPORT", "USER").anyRequest()
						.authenticated())
				.addFilterBefore(f,
						org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	private CorsConfigurationSource cors() {
		CorsConfiguration c = new CorsConfiguration();
		c.setAllowedOrigins(List.of("http://localhost:3000"));
		c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		c.setAllowedHeaders(List.of("Authorization", "Content-Type"));
		c.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
		s.registerCorsConfiguration("/**", c);
		return s;
	}
}
