package com.hedatou.wallet.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.View;

import com.hedatou.wallet.service.CategoryService;

@Controller
@RequestMapping("category")
public class CategoryController extends ControllerSupport {

	@Autowired
	private CategoryService service;

	@RequestMapping("sorted")
	public View sorted(Model model) {
		model.addAttribute("data", service.sorted()).addAttribute("success",
				true);
		return view;
	}

	@RequestMapping("income")
	public View income(Model model) {
		model.addAttribute("data", service.income()).addAttribute("success",
				true);
		return view;
	}

	@RequestMapping("outlay")
	public View outlay(Model model) {
		model.addAttribute("data", service.outlay()).addAttribute("success",
				true);
		return view;
	}

	@RequestMapping("transfer")
	public View transfer(Model model) {
		model.addAttribute("data", service.transfer()).addAttribute("success",
				true);
		return view;
	}

}
