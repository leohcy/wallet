package com.hedatou.wallet.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hedatou.wallet.dao.AccountDao;
import com.hedatou.wallet.dao.CategoryDao;
import com.hedatou.wallet.dao.RecordDao;
import com.hedatou.wallet.domain.Category;
import com.hedatou.wallet.domain.Category.CategoryType;

@Service
@Transactional(readOnly = true)
public class StatisticsService {

	@Autowired
	private RecordDao recordDao;
	@Autowired
	private CategoryDao categoryDao;
	@Autowired
	private AccountDao accountDao;

	public List<Map<String, Object>> latest30DaysOutlay() {
		DateTime start = DateTime.now().millisOfDay().withMinimumValue()
				.minusDays(30);
		DateTime end = DateTime.now().millisOfDay().withMaximumValue();
		return recordDao.groupByCategory(CategoryType.支出, start.toDate(),
				end.toDate());
	}

	public List<Map<String, Object>> latestWeekOutlay(int weeks) {
		List<Category> categories = categoryDao.byType(CategoryType.支出);
		DateTime start = DateTime.now().dayOfWeek().withMinimumValue()
				.millisOfDay().withMinimumValue().minusWeeks(weeks - 1);
		DateTime end = DateTime.now().dayOfWeek().withMaximumValue()
				.millisOfDay().withMaximumValue();
		List<Map<String, Object>> outlays = recordDao.categoriesGroupByWeek(
				categories, start.toDate(), end.toDate());
		for (Map<String, Object> outlay : outlays) {
			DateTime monday = DateTime.now()
					.withWeekyear((Integer) outlay.get("year"))
					.withWeekOfWeekyear((Integer) outlay.get("week"))
					.dayOfWeek().withMinimumValue();
			DateTime sunday = monday.dayOfWeek().withMaximumValue();
			outlay.put("monday", monday.toDate());
			outlay.put("sunday", sunday.toDate());
		}
		return outlays;
	}

	public List<Map<String, Object>> latestMonthOutlay(int months) {
		List<Category> categories = categoryDao.byType(CategoryType.支出);
		DateTime start = DateTime.now().dayOfMonth().withMinimumValue()
				.millisOfDay().withMinimumValue().minusMonths(months - 1);
		DateTime end = DateTime.now().dayOfMonth().withMaximumValue()
				.millisOfDay().withMaximumValue();
		return recordDao.categoriesGroupByMonth(categories, start.toDate(),
				end.toDate());
	}

	public List<Map<String, Object>> latestMonth(int months) {
		DateTime start = DateTime.now().dayOfMonth().withMinimumValue()
				.millisOfDay().withMinimumValue().minusMonths(months - 1);
		DateTime end = DateTime.now().dayOfMonth().withMaximumValue()
				.millisOfDay().withMaximumValue();
		BigDecimal balance = accountDao.total();
		List<Map<String, Object>> stats = recordDao.groupByMonth(
				start.toDate(), end.toDate());
		for (int i = stats.size() - 1; i >= 0; i--) {
			stats.get(i).put("balance", balance);
			balance = balance.subtract((BigDecimal) stats.get(i).get("income"))
					.add((BigDecimal) stats.get(i).get("outlay"));
		}
		return stats;
	}

}
