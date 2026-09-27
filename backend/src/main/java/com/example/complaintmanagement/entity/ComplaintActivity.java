package com.example.complaintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaint_activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintActivity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	private Complaint complaint;
	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	private User performedBy;
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ActivityType activityType;
	@Column(nullable = false, length = 1000)
	private String description;
	private LocalDateTime createdAt;
}
