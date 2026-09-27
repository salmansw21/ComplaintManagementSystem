package com.example.complaintmanagement.controller;

import com.example.complaintmanagement.dto.DashboardDtos;
import com.example.complaintmanagement.service.ComplaintService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
	final ComplaintService s;

	public DashboardController(ComplaintService s) {
		this.s = s;
	}

	@GetMapping
	public DashboardDtos.Dashboard dashboard() {
		return s.dashboard();
	}
}