package com.hedatou.wallet.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.support.WebArgumentResolver;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter;

@Controller
public class PagingParamHandler {

	@Autowired
	private PagingParams pagingParams;

	@Autowired
	void registerHandler(AnnotationMethodHandlerAdapter handlerAdapter) {
		handlerAdapter.setCustomArgumentResolver(new WebArgumentResolver() {
			public Object resolveArgument(MethodParameter methodParameter,
					NativeWebRequest webRequest) throws Exception {
				if (!PagingParams.class.equals(methodParameter
						.getParameterType()))
					return UNRESOLVED;
				try {
					String start = webRequest.getParameter("start");
					String limit = webRequest.getParameter("limit");
					pagingParams.setStart(Integer.parseInt(start));
					pagingParams.setLimit(Integer.parseInt(limit));
					return pagingParams;
				} catch (Exception e) {
					throw new MessageSourceException("paging.params.not.found",
							"无法获取分页信息", e);
				}
			}
		});
	}

}
