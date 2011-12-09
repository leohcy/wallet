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
import com.hedatou.wallet.domain.OutlayRecord;
import com.hedatou.wallet.domain.Record;
import com.hedatou.wallet.domain.TransferRecord;

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
		} else if (record instanceof OutlayRecord) {
			OutlayRecord outlay = (OutlayRecord) record;
			Account account = outlay.getOutlayAccount();
			accountDao.refresh(account);
			account.setLastUpdate(new Date());
			account.setBalance(account.getBalance()
					.subtract(outlay.getAmount()));
		} else if (record instanceof TransferRecord) {
			TransferRecord transfer = (TransferRecord) record;
			Account from = transfer.getFromAccount();
			accountDao.refresh(from);
			from.setLastUpdate(new Date());
			from.setBalance(from.getBalance().subtract(transfer.getAmount()));
			Account to = transfer.getToAccount();
			accountDao.refresh(to);
			to.setLastUpdate(new Date());
			to.setBalance(to.getBalance().add(transfer.getAmount()));
		}
		dao.save(record);
	}

	@Transactional
	public void remove(long id) {
		Record record = dao.get(id);
		Category category = record.getCategory();
		category.setLastUpdate(new Date());
		category.setTotal(category.getTotal().subtract(record.getAmount()));

		if (record instanceof IncomeRecord) {
			IncomeRecord income = (IncomeRecord) record;
			Account account = income.getIncomeAccount();
			account.setLastUpdate(new Date());
			account.setBalance(account.getBalance()
					.subtract(income.getAmount()));
		} else if (record instanceof OutlayRecord) {
			OutlayRecord outlay = (OutlayRecord) record;
			Account account = outlay.getOutlayAccount();
			account.setLastUpdate(new Date());
			account.setBalance(account.getBalance().add(outlay.getAmount()));
		} else if (record instanceof TransferRecord) {
			TransferRecord transfer = (TransferRecord) record;
			Account from = transfer.getFromAccount();
			from.setLastUpdate(new Date());
			from.setBalance(from.getBalance().add(transfer.getAmount()));
			Account to = transfer.getToAccount();
			to.setLastUpdate(new Date());
			to.setBalance(to.getBalance().subtract(transfer.getAmount()));
		}
		dao.delete(record);
	}

}
