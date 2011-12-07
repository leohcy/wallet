package com.hedatou.wallet.service;

import java.util.List;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hedatou.wallet.dao.RecordDao;
import com.hedatou.wallet.domain.Category.CategoryType;
import com.hedatou.wallet.dto.Pair;

@Service
@Transactional(readOnly = true)
public class StatisticsService {

	@Autowired
	private RecordDao recordDao;

	public List<Pair> latest30DaysOutlay() {
		DateTime start = DateTime.now().millisOfDay().withMinimumValue()
				.minusDays(30);
		DateTime end = DateTime.now().millisOfDay().withMaximumValue();
		return recordDao.groupByCategory(CategoryType.支出, start.toDate(),
				end.toDate());
	}

}
