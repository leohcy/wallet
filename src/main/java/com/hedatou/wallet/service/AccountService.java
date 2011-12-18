package com.hedatou.wallet.service;

import java.util.Date;
import java.util.List;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hedatou.wallet.dao.AccountDao;
import com.hedatou.wallet.dao.CategoryDao;
import com.hedatou.wallet.domain.Account;
import com.hedatou.wallet.domain.Category;
import com.hedatou.wallet.domain.Category.CategoryType;
import com.hedatou.wallet.domain.IncomeRecord;
import com.hedatou.wallet.domain.OutlayRecord;
import com.hedatou.wallet.util.MessageSourceException;

@Service
@Transactional(readOnly = true)
public class AccountService {

	@Autowired
	private AccountDao dao;
	@Autowired
	private CategoryDao categoryDao;
	@Autowired
	private RecordService recordService;

	public List<Account> displayed() {
		return dao.displayed();
	}

	public List<Account> sorted() {
		return dao.sorted();
	}

	@Transactional
	public void display(long id) {
		Account account = dao.get(id);
		account.setDisplay(!account.getDisplay());
	}

	@Transactional
	public void income(long id) {
		Account oldDefault = dao.defaultIncome();
		if (oldDefault != null)
			oldDefault.setDefaultIncome(false);
		Account newDefault = dao.get(id);
		if (newDefault != null)
			newDefault.setDefaultIncome(true);
	}

	@Transactional
	public void outlay(long id) {
		Account oldDefault = dao.defaultOutlay();
		if (oldDefault != null)
			oldDefault.setDefaultOutlay(false);
		Account newDefault = dao.get(id);
		if (newDefault != null)
			newDefault.setDefaultOutlay(true);
	}

	@Transactional
	public void update(Account account) {
		Account old = dao.get(account.getId());
		int compare = account.getBalance().compareTo(old.getBalance());
		if (compare > 0) {
			IncomeRecord income = new IncomeRecord();
			income.setAmount(account.getBalance().subtract(old.getBalance()));
			Category checks = categoryDao.checksByType(CategoryType.收入);
			if (checks == null)
				throw new MessageSourceException("checks.not.set");
			income.setCategory(checks);
			income.setIncomeAccount(account);
			income.setOccurTime(DateTime.now().toDate());
			income.setDescription("系统自动添加");
			recordService.save(income);
		} else if (compare < 0) {
			OutlayRecord outlay = new OutlayRecord();
			outlay.setAmount(old.getBalance().subtract(account.getBalance()));
			Category checks = categoryDao.checksByType(CategoryType.支出);
			if (checks == null)
				throw new MessageSourceException("checks.not.set");
			outlay.setCategory(checks);
			outlay.setOutlayAccount(account);
			outlay.setOccurTime(DateTime.now().toDate());
			outlay.setDescription("系统自动添加");
			recordService.save(outlay);
		}
		account.setLastUpdate(new Date());
		account.setCreateTime(old.getCreateTime());
		account.setDefaultIncome(old.getDefaultIncome());
		account.setDefaultOutlay(old.getDefaultOutlay());
		account.setDisplay(old.getDisplay());
		dao.merge(account);
	}

}
