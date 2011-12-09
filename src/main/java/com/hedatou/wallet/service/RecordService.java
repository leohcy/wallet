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
import com.hedatou.wallet.domain.Account.AccountType;
import com.hedatou.wallet.domain.Category;
import com.hedatou.wallet.domain.Category.CategoryType;
import com.hedatou.wallet.domain.IncomeRecord;
import com.hedatou.wallet.domain.Record;

@Service
@Transactional(readOnly = true)
public class RecordService {

	@Autowired
	private RecordDao dao;
	@Autowired
	private CategoryDao categoryDao;
	@Autowired
	private AccountDao accountDao;

	public List<Record> query(CategoryType categoryType, Long category,
			AccountType accountType, Long account, Date startDate,
			Date endDate, BigDecimal minAmount, BigDecimal maxAmount,
			String keyword) {
		if (startDate != null)
			startDate = new DateTime(startDate).millisOfDay()
					.withMinimumValue().toDate();
		if (endDate != null)
			endDate = new DateTime(endDate).millisOfDay().withMaximumValue()
					.toDate();
		return dao.query(categoryType, category, accountType, account,
				startDate, endDate, minAmount, maxAmount, keyword);
	}

	@Transactional
	public void save(Record record) {
		Category category = record.getCategory();
		categoryDao.refresh(category);
		category.setLastUpdate(new Date());
		category.setTotal(category.getTotal().add(record.getAmount()));

		if (record instanceof IncomeRecord) {
			IncomeRecord income = (IncomeRecord) record;
			Account account = income.getIncomeAccount();
			accountDao.refresh(account);
			account.setLastUpdate(new Date());
			account.setBalance(account.getBalance().add(income.getAmount()));
		}
		dao.save(record);
	}

}
