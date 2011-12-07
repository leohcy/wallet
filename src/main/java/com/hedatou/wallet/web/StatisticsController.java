package com.hedatou.wallet.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.View;

import com.hedatou.wallet.service.StatisticsService;

@Controller
@RequestMapping("statistics")
public class StatisticsController extends ControllerSupport {

	@Autowired
	private StatisticsService service;

	@RequestMapping("latest30DaysOutlay")
	public View latest30DaysOutlay(Model model) {
		model.addAttribute("data", service.latest30DaysOutlay()).addAttribute(
				"success", true);
		return view;
	}

}
