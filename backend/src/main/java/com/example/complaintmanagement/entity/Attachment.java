package com.example.complaintmanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	private Complaint complaint;
	@Column(nullable = false)
	private String fileName;
	@Column(nullable = false)
	private String fileUrl;
	private String contentType;
	private Long fileSize;
	private LocalDateTime uploadedAt;
}
