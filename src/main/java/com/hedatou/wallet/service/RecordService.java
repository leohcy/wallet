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
@Transactional
public class RecordService {

	@Autowired
	private RecordDao dao;
	@Autowired
	private CategoryDao categoryDao;
	@Autowired
	private AccountDao accountDao;

	@Transactional(readOnly = true)
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

	public void save(Record record) {
		Category category = categoryDao.get(record.getCategory().getId());
		record.setCategory(category);
		category.setLastUpdate(new Date());
		category.setTotal(category.getTotal().add(record.getAmount()));
		if (record instanceof IncomeRecord) {
			IncomeRecord income = (IncomeRecord) record;
			Account account = accountDao.get(income.getIncomeAccount().getId());
			income.setIncomeAccount(account);
			account.setLastUpdate(new Date());
			account.setBalance(account.getBalance().add(income.getAmount()));
		} else if (record instanceof OutlayRecord) {
			OutlayRecord outlay = (OutlayRecord) record;
			Account account = accountDao.get(outlay.getOutlayAccount().getId());
			outlay.setOutlayAccount(account);
			account.setLastUpdate(new Date());
			account.setBalance(account.getBalance()
					.subtract(outlay.getAmount()));
		} else if (record instanceof TransferRecord) {
			TransferRecord transfer = (TransferRecord) record;
			Account from = accountDao.get(transfer.getFromAccount().getId());
			transfer.setFromAccount(from);
			from.setLastUpdate(new Date());
			from.setBalance(from.getBalance().subtract(transfer.getAmount()));
			Account to = accountDao.get(transfer.getToAccount().getId());
			transfer.setToAccount(to);
			to.setLastUpdate(new Date());
			to.setBalance(to.getBalance().add(transfer.getAmount()));
		}
		dao.save(record);
	}

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

	public void update(Record record) {
		Record old = dao.get(record.getId());
		Category oldc = old.getCategory(), newc = categoryDao.get(record
				.getCategory().getId());
		record.setCategory(newc);
		if (!oldc.equals(newc)
				|| old.getAmount().compareTo(record.getAmount()) != 0) {
			oldc.setLastUpdate(new Date());
			oldc.setTotal(oldc.getTotal().subtract(old.getAmount()));
			newc.setLastUpdate(new Date());
			newc.setTotal(newc.getTotal().add(record.getAmount()));
		}
		if (record instanceof IncomeRecord) {
			Account oldi = ((IncomeRecord) old).getIncomeAccount(), newi = accountDao
					.get(((IncomeRecord) record).getIncomeAccount().getId());
			((IncomeRecord) record).setIncomeAccount(newi);
			if (!oldi.equals(newi)
					|| old.getAmount().compareTo(record.getAmount()) != 0) {
				oldi.setLastUpdate(new Date());
				oldi.setBalance(oldi.getBalance().subtract(old.getAmount()));
				newi.setLastUpdate(new Date());
				newi.setBalance(newi.getBalance().add(record.getAmount()));
			}
		} else if (record instanceof OutlayRecord) {
			Account oldo = ((OutlayRecord) old).getOutlayAccount(), newo = accountDao
					.get(((OutlayRecord) record).getOutlayAccount().getId());
			((OutlayRecord) record).setOutlayAccount(newo);
			if (!oldo.equals(newo)
					|| old.getAmount().compareTo(record.getAmount()) != 0) {
				oldo.setLastUpdate(new Date());
				oldo.setBalance(oldo.getBalance().add(old.getAmount()));
				newo.setLastUpdate(new Date());
				newo.setBalance(newo.getBalance().subtract(record.getAmount()));
			}
		} else if (record instanceof TransferRecord) {
			Account oldf = ((TransferRecord) old).getFromAccount(), newf = accountDao
					.get(((TransferRecord) record).getFromAccount().getId());
			((TransferRecord) record).setFromAccount(newf);
			Account oldt = ((TransferRecord) old).getToAccount(), newt = accountDao
					.get(((TransferRecord) record).getToAccount().getId());
			((TransferRecord) record).setToAccount(newt);
			if (!oldf.equals(newf)
					|| old.getAmount().compareTo(record.getAmount()) != 0) {
				oldf.setLastUpdate(new Date());
				oldf.setBalance(oldf.getBalance().add(old.getAmount()));
				newf.setLastUpdate(new Date());
				newf.setBalance(newf.getBalance().subtract(record.getAmount()));
			}
			if (!oldt.equals(newt)
					|| old.getAmount().compareTo(record.getAmount()) != 0) {
				oldt.setLastUpdate(new Date());
				oldt.setBalance(oldt.getBalance().subtract(old.getAmount()));
				newt.setLastUpdate(new Date());
				newt.setBalance(newt.getBalance().add(record.getAmount()));
			}
		}
		dao.merge(record);
	}

}
