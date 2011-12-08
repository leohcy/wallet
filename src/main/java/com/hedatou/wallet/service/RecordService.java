package com.hedatou.wallet.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hedatou.wallet.dao.RecordDao;
import com.hedatou.wallet.domain.Account.AccountType;
import com.hedatou.wallet.domain.Category.CategoryType;
import com.hedatou.wallet.domain.Record;

@Service
@Transactional(readOnly = true)
public class RecordService {

	@Autowired
	private RecordDao dao;

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
}
