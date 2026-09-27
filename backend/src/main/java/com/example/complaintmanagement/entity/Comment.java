package com.example.complaintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	private Complaint complaint;
	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	private User user;
	@Column(nullable = false, length = 3000)
	private String message;
	private LocalDateTime createdAt;
}
