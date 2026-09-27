package com.example.complaintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "complaints", uniqueConstraints = @UniqueConstraint(columnNames = "complaintNumber"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false, unique = true)
	private String complaintNumber;
	@Column(nullable = false)
	private String title;
	@Column(nullable = false, length = 5000)
	private String description;
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ComplaintStatus status;
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Priority priority;
	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	private Category category;
	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	private User createdBy;
	@ManyToOne(fetch = FetchType.EAGER)
	private User assignedTo;
	@Column(length = 5000)
	private String resolutionNote;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private LocalDateTime resolvedAt;
	private LocalDateTime closedAt;
}
