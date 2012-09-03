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

	@RequestMapping("latestWeekOutlay")
	public View latestWeekOutlay(int weeks, Model model) {
		model.addAttribute("data", service.latestWeekOutlay(weeks))
				.addAttribute("success", true);
		return view;
	}

	@RequestMapping("latestMonthOutlay")
	public View latestMonthOutlay(int months, Model model) {
		model.addAttribute("data", service.latestMonthOutlay(months))
				.addAttribute("success", true);
		return view;
	}

	@RequestMapping("latestMonth")
	public View latestMonth(int months, Model model) {
		model.addAttribute("data", service.latestMonth(months)).addAttribute(
				"success", true);
		return view;
	}

}
