package com.example.complaintmanagement.controller;

import com.example.complaintmanagement.dto.DashboardDtos;
import com.example.complaintmanagement.service.ComplaintService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
	final ComplaintService s;

	public AdminController(ComplaintService s) {
		this.s = s;
	}

	@GetMapping("/dashboard")
	public DashboardDtos.Dashboard dashboard() {
		return s.dashboard();
	}
}