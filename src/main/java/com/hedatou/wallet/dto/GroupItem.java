package com.hedatou.wallet.dto;

public class GroupItem {

	private String name;
	private Object value;

	public GroupItem(String name, Object value) {
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
