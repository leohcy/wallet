package com.hedatou.wallet.web;

import java.math.BigDecimal;
import java.util.Date;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.View;

import com.hedatou.wallet.domain.Account.AccountType;
import com.hedatou.wallet.domain.Category.CategoryType;
import com.hedatou.wallet.domain.IncomeRecord;
import com.hedatou.wallet.service.RecordService;
import com.hedatou.wallet.util.PagingParams;

@Controller
@RequestMapping("record")
public class RecordController extends ControllerSupport {

	@Autowired
	private RecordService service;

	@RequestMapping("query")
	public View query(CategoryType categoryType, Long category,
			AccountType accountType, Long account,
			@DateTimeFormat(iso = ISO.DATE) Date startDate,
			@DateTimeFormat(iso = ISO.DATE) Date endDate, BigDecimal minAmount,
			BigDecimal maxAmount, String keyword, PagingParams paging,
			Model model) {
		model.addAttribute(
				"data",
				service.query(categoryType, category, accountType, account,
						startDate, endDate, minAmount, maxAmount, keyword))
				.addAttribute("total", paging.getTotal())
				.addAttribute("success", true);
		return view;
	}

	@RequestMapping(value = "income")
	public View income(@Valid IncomeRecord record, BindingResult binding,
			Model model) {
		if (binding.hasErrors())
			return handleBindingError(binding, model);
		service.save(record);
		model.addAttribute("success", true);
		return view;
	}

}
