package com.example.complaintmanagement.dto;

import java.util.*;

public class DashboardDtos {
	public record Stats(long totalComplaints, long submitted, long underReview, long assigned, long inProgress,
			long resolved, long closed, long reopened, long urgentComplaints, long totalUsers, long totalSupport) {
	}

	public record Dashboard(Stats stats,List<ComplaintDtos.Response> recentComplaints,List<UserDtos.UserResponse> recentUsers,Map<String,Long> byCategory,Map<String,Long> byStatus,Map<String,Long> byPriority){} }
