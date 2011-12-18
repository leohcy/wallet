package com.hedatou.wallet.util;

@SuppressWarnings("serial")
public class MessageSourceException extends RuntimeException {

	public MessageSourceException(String code) {
		super(code);
		this.code = code;
	}

	public MessageSourceException(String code, Throwable cause) {
		super(code, cause);
		this.code = code;
	}

	private String code;

	public String getCode() {
		return code;
	}

}
