package com.hedatou.wallet.web;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.View;

import com.hedatou.wallet.domain.Account;
import com.hedatou.wallet.service.AccountService;

@Controller
@RequestMapping("account")
public class AccountController extends ControllerSupport {

	@Autowired
	private AccountService service;

	@RequestMapping("displayed")
	public View displayed(Model model) {
		model.addAttribute("data", service.displayed()).addAttribute("success",
				true);
		return view;
	}

	@RequestMapping("sorted")
	public View sorted(Model model) {
		model.addAttribute("data", service.sorted()).addAttribute("success",
				true);
		return view;
	}

	@RequestMapping("display")
	public View display(long id, Model model) {
		service.display(id);
		model.addAttribute("success", true);
		return view;
	}

	@RequestMapping("income")
	public View income(long id, Model model) {
		service.income(id);
		model.addAttribute("success", true);
		return view;
	}

	@RequestMapping("outlay")
	public View outlay(long id, Model model) {
		service.outlay(id);
		model.addAttribute("success", true);
		return view;
	}

	@RequestMapping("save")
	public View save(@Valid Account account, BindingResult binding, Model model) {
		if (binding.hasErrors())
			return handleBindingError(binding, model);
		service.save(account);
		model.addAttribute("success", true);
		return view;
	}

	@RequestMapping("update")
	public View update(@Valid Account account, BindingResult binding,
			Model model) {
		if (binding.hasErrors())
			return handleBindingError(binding, model);
		service.update(account);
		model.addAttribute("success", true);
		return view;
	}

	@RequestMapping(value = "remove")
	public View remove(long id, Model model) {
		service.remove(id);
		model.addAttribute("success", true);
		return view;
	}

	@RequestMapping(value = "sort")
	public View sort(long source, long target, boolean before, Model model) {
		service.sort(source, target, before);
		model.addAttribute("success", true);
		return view;
	}

}
