package com.till.exceptions;

public class NoSuchEntityException extends RuntimeException {

	private static final long serialVersionUID = -8461555727186437772L;

	public NoSuchEntityException(Class<?> clazz, String id) {
		super(String.format("%s with ID: '%s' was not found", clazz.getSimpleName(), id));
	}
}
