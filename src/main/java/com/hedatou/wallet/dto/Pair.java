package com.hedatou.wallet.dto;

public class Pair {

	private String name;
	private Object value;

	public Pair(String name, Object value) {
		this.name = name;
		this.value = value;
	}

	public String getName() {
		return name;
	}

	public Object getValue() {
		return value;
	}

}
