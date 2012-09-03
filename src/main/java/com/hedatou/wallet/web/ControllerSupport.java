package com.hedatou.wallet.web;

import java.util.Locale;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.View;

import com.google.common.collect.Maps;
import com.hedatou.wallet.util.MessageSourceException;

public abstract class ControllerSupport {

	private final Logger logger = LoggerFactory.getLogger(getClass());
	@Autowired
	private MessageSource messageSource;
	@Autowired
	protected View view;

	@ExceptionHandler
	public ModelAndView exception(Exception e) {
		String code = e.getClass().getName();
		if (e instanceof MessageSourceException)
			code = ((MessageSourceException) e).getCode();
		String message = messageSource.getMessage(code, null, e.getMessage(),
				Locale.getDefault());
		logger.warn(message, e);
		return new ModelAndView(view).addObject("message", message).addObject(
				"success", false);
	}

	protected View handleBindingError(BindingResult binding, Model model) {
		Map<String, String> errors = Maps.newHashMap();
		for (FieldError error : binding.getFieldErrors()) {
			errors.put(error.getField(),
					messageSource.getMessage(error, Locale.getDefault()));
		}
		model.addAttribute("errors", errors).addAttribute("success", false);
		return view;
	}

}
