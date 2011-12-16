package com.hedatou.wallet.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.View;

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

	@RequestMapping("switchDisplay")
	public View switchDisplay(long id, Model model) {
		service.switchDisplay(id);
		model.addAttribute("success", true);
		return view;
	}

	@RequestMapping("setIncome")
	public View setIncome(long id, Model model) {
		service.setIncome(id);
		model.addAttribute("success", true);
		return view;
	}

	@RequestMapping("setOutlay")
	public View setOutlay(long id, Model model) {
		service.setOutlay(id);
		model.addAttribute("success", true);
		return view;
	}

}
