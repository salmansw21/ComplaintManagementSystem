package com.example.complaintmanagement.config;

import com.example.complaintmanagement.entity.*;
import com.example.complaintmanagement.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.*;

@Configuration
public class DataSeeder {
	@Bean
	CommandLineRunner seed(UserRepository ur, CategoryRepository cr, ComplaintRepository comp, PasswordEncoder pe) {
		return a -> {
			if (ur.count() == 0) {
				ur.saveAll(List.of(user("Admin", "User", "admin", "admin@example.com", "admin123", Role.ADMIN, pe),
						user("Support", "Staff", "support", "support@example.com", "support123", Role.SUPPORT, pe),
						user("Normal", "User", "user", "user@example.com", "user123", Role.USER, pe),
						user("Sara", "Khan", "sara", "sara@example.com", "user123", Role.USER, pe),
						user("Ali", "Shah", "ali", "ali@example.com", "user123", Role.USER, pe),
						user("Ayesha", "Malik", "ayesha", "ayesha@example.com", "user123", Role.USER, pe),
						user("Bilal", "Ahmad", "bilal", "bilal@example.com", "user123", Role.USER, pe),
						user("Hamza", "Khan", "hamza", "hamza@example.com", "user123", Role.USER, pe),
						user("Support", "Two", "support2", "support2@example.com", "support123", Role.SUPPORT, pe)));
			}
			if (cr.count() == 0) {
				String[] ns = { "Technical Issue", "Billing", "Customer Service", "Product Complaint", "Delivery",
						"Account", "Website", "Other" };
				for (String n : ns)
					cr.save(Category.builder().name(n).description(n + " related complaints").active(true).build());
			}
		};
	}

	private User user(String f, String l, String u, String e, String p, Role r, PasswordEncoder pe) {
		return User.builder().firstName(f).lastName(l).username(u).email(e).password(pe.encode(p)).role(r).active(true)
				.createdAt(LocalDateTime.now()).build();
	}
}
