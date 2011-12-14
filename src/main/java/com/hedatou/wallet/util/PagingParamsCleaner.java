package com.hedatou.wallet.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class PagingParamsCleaner extends HandlerInterceptorAdapter {

	@Autowired
	private PagingParams pagingParams;

	@Override
	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		pagingParams.finish();
	}

}
