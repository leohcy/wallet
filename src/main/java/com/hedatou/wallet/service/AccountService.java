package com.hedatou.wallet.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hedatou.wallet.dao.AccountDao;
import com.hedatou.wallet.dao.CategoryDao;
import com.hedatou.wallet.dao.RecordDao;
import com.hedatou.wallet.domain.Account;
import com.hedatou.wallet.domain.Category;
import com.hedatou.wallet.domain.Category.CategoryType;
import com.hedatou.wallet.domain.IncomeRecord;
import com.hedatou.wallet.domain.OutlayRecord;
import com.hedatou.wallet.util.MessageSourceException;

@Service
@Transactional
public class AccountService {

	@Autowired
	private AccountDao dao;
	@Autowired
	private CategoryDao categoryDao;
	@Autowired
	private RecordDao recordDao;

	@Transactional(readOnly = true)
	public List<Account> displayed() {
		return dao.displayed();
	}

	@Transactional(readOnly = true)
	public List<Account> sorted() {
		return dao.sorted();
	}

	public void display(long id) {
		Account account = dao.get(id);
		account.setDisplay(!account.getDisplay());
	}

	public void income(long id) {
		Account oldDefault = dao.defaultIncome();
		Account newDefault = dao.get(id);
		if (oldDefault != null)
			oldDefault.setDefaultIncome(false);
		if (newDefault != null)
			newDefault.setDefaultIncome(true);
	}

	public void outlay(long id) {
		Account oldDefault = dao.defaultOutlay();
		Account newDefault = dao.get(id);
		if (oldDefault != null)
			oldDefault.setDefaultOutlay(false);
		if (newDefault != null)
			newDefault.setDefaultOutlay(true);
	}

	public void save(Account account) {
		account.setLastUpdate(new Date());
		account.setDefaultIncome(false);
		account.setDefaultOutlay(false);
		account.setOrderNo(dao.maxOrder());
		dao.save(account);
	}

	public void update(Account account) {
		Account old = dao.get(account.getId());
		int compare = account.getBalance().compareTo(old.getBalance());
		if (compare > 0) {
			BigDecimal amount = account.getBalance().subtract(old.getBalance());
			Category checks = categoryDao.checksByType(CategoryType.收入);
			if (checks == null)
				throw new MessageSourceException("checks.not.set");
			checks.setTotal(checks.getTotal().add(amount));
			checks.setLastUpdate(new Date());
			IncomeRecord income = new IncomeRecord();
			income.setAmount(amount);
			income.setCategory(checks);
			income.setIncomeAccount(account);
			income.setOccurTime(DateTime.now().minusSeconds(5).toDate());
			income.setDescription("系统自动添加");
			recordDao.save(income);
		} else if (compare < 0) {
			BigDecimal amount = old.getBalance().subtract(account.getBalance());
			Category checks = categoryDao.checksByType(CategoryType.支出);
			if (checks == null)
				throw new MessageSourceException("checks.not.set");
			checks.setTotal(checks.getTotal().add(amount));
			checks.setLastUpdate(new Date());
			OutlayRecord outlay = new OutlayRecord();
			outlay.setAmount(amount);
			outlay.setCategory(checks);
			outlay.setOutlayAccount(account);
			outlay.setOccurTime(DateTime.now().minusSeconds(5).toDate());
			outlay.setDescription("系统自动添加");
			recordDao.save(outlay);
		}
		account.setLastUpdate(new Date());
		account.setDefaultIncome(old.getDefaultIncome());
		account.setDefaultOutlay(old.getDefaultOutlay());
		account.setOrderNo(old.getOrderNo());
		dao.merge(account);
	}

	public void remove(long id) {
		dao.delete(id);
	}

	public void sort(long source, long target, boolean before) {
		int from = dao.get(source).getOrderNo(), to = dao.get(target)
				.getOrderNo();
		if (from < to) {
			List<Account> accounts = dao.between(from, true, to, !before);
			int tmp = accounts.get(accounts.size() - 1).getOrderNo();
			for (int i = accounts.size() - 1; i > 0; i--)
				accounts.get(i).setOrderNo(accounts.get(i - 1).getOrderNo());
			accounts.get(0).setOrderNo(tmp);
		} else if (from > to) {
			List<Account> accounts = dao.between(to, before, from, true);
			int tmp = accounts.get(0).getOrderNo();
			for (int i = 0; i < accounts.size() - 1; i++)
				accounts.get(i).setOrderNo(accounts.get(i + 1).getOrderNo());
			accounts.get(accounts.size() - 1).setOrderNo(tmp);
		}
	}

}
