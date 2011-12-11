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
import com.hedatou.wallet.domain.OutlayRecord;
import com.hedatou.wallet.domain.Record;
import com.hedatou.wallet.domain.TransferRecord;
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

	@RequestMapping(value = "save/income")
	public View save(@Valid IncomeRecord record, BindingResult binding,
			Model model) {
		return _save(record, binding, model);
	}

	@RequestMapping(value = "save/outlay")
	public View save(@Valid OutlayRecord record, BindingResult binding,
			Model model) {
		return _save(record, binding, model);
	}

	@RequestMapping(value = "save/transfer")
	public View save(@Valid TransferRecord record, BindingResult binding,
			Model model) {
		return _save(record, binding, model);
	}

	@RequestMapping(value = "remove")
	public View remove(long id, Model model) {
		service.remove(id);
		model.addAttribute("success", true);
		return view;
	}

	@RequestMapping(value = "update/income")
	public View update(@Valid IncomeRecord record, BindingResult binding,
			Model model) {
		return _update(record, binding, model);
	}

	@RequestMapping(value = "update/outlay")
	public View update(@Valid OutlayRecord record, BindingResult binding,
			Model model) {
		return _update(record, binding, model);
	}

	@RequestMapping(value = "update/transfer")
	public View update(@Valid TransferRecord record, BindingResult binding,
			Model model) {
		return _update(record, binding, model);
	}

	private View _save(Record record, BindingResult binding, Model model) {
		if (binding.hasErrors())
			return handleBindingError(binding, model);
		service.save(record);
		model.addAttribute("success", true);
		return view;
	}

	private View _update(Record record, BindingResult binding, Model model) {
		if (binding.hasErrors())
			return handleBindingError(binding, model);
		service.update(record);
		model.addAttribute("success", true);
		return view;
	}

}
