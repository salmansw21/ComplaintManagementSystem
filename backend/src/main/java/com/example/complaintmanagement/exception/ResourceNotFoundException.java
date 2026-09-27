package com.example.complaintmanagement.exception;

public class ResourceNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ResourceNotFoundException(String m) {
		super(m);
	}
}