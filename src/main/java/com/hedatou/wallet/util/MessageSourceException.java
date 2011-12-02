package com.hedatou.wallet.util;

@SuppressWarnings("serial")
public class MessageSourceException extends RuntimeException {

	public MessageSourceException(String code, String message) {
		super(message);
		this.code = code;
	}

	public MessageSourceException(String code, String message, Throwable cause) {
		super(message, cause);
		this.code = code;
	}

	private String code;

	public String getCode() {
		return code;
	}

}
