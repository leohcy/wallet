package com.hedatou.wallet.dao;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.hibernate.sql.JoinType;
import org.springframework.stereotype.Repository;

import com.google.common.base.Strings;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Maps;
import com.hedatou.wallet.domain.Account.AccountType;
import com.hedatou.wallet.domain.Category;
import com.hedatou.wallet.domain.Category.CategoryType;
import com.hedatou.wallet.domain.Record;

@Repository
public class RecordDao extends DaoSupport<Record> {

	public List<Map<String, Object>> groupByCategory(CategoryType type,
			Date start, Date end) {
		String hql = "select new map(c.name as name, sum(r.amount) as amount)"
				+ " from Record r join r.category c"
				+ " where c.type=:type and r.occurTime between :start and :end"
				+ " group by c order by amount desc";
		return maps(hql,
				ImmutableMap.of("type", type, "start", start, "end", end));
	}

	@SuppressWarnings("unchecked")
	public List<Record> query(CategoryType categoryType, Long category,
			AccountType accountType, Long account, Date startDate,
			Date endDate, BigDecimal minAmount, BigDecimal maxAmount,
			String keyword) {
		Criteria criteria = criteria();
		if (categoryType != null || category != null) {
			criteria.createAlias("category", "c");
			if (categoryType != null)
				criteria.add(Restrictions.eq("c.type", categoryType));
			if (category != null)
				criteria.add(Restrictions.eq("c.id", category));
		}
		if (accountType != null || account != null) {
			criteria.createAlias("incomeAccount", "i", JoinType.LEFT_OUTER_JOIN)
					.createAlias("outlayAccount", "o", JoinType.LEFT_OUTER_JOIN)
					.createAlias("fromAccount", "f", JoinType.LEFT_OUTER_JOIN)
					.createAlias("toAccount", "t", JoinType.LEFT_OUTER_JOIN);
			if (accountType != null) {
				criteria.add(Restrictions.disjunction()
						.add(Restrictions.eq("i.type", accountType))
						.add(Restrictions.eq("o.type", accountType))
						.add(Restrictions.eq("f.type", accountType))
						.add(Restrictions.eq("t.type", accountType)));
			}
			if (account != null) {
				criteria.add(Restrictions.disjunction()
						.add(Restrictions.eq("i.id", account))
						.add(Restrictions.eq("o.id", account))
						.add(Restrictions.eq("f.id", account))
						.add(Restrictions.eq("t.id", account)));
			}
		}
		if (startDate != null)
			criteria.add(Restrictions.ge("occurTime", startDate));
		if (endDate != null)
			criteria.add(Restrictions.le("occurTime", endDate));
		if (minAmount != null)
			criteria.add(Restrictions.ge("amount", minAmount));
		if (maxAmount != null)
			criteria.add(Restrictions.le("amount", maxAmount));
		if (!Strings.isNullOrEmpty(keyword))
			criteria.add(Restrictions.ilike("description", keyword,
					MatchMode.ANYWHERE));
		return paging(criteria).addOrder(Order.desc("occurTime")).list();
	}

	public List<Map<String, Object>> groupByWeek(List<Category> categories,
			Date start, Date end) {
		Map<String, Object> params = Maps.newHashMap();
		params.put("outlay", CategoryType.支出);
		params.put("start", start);
		params.put("end", end);
		StringBuilder sql = new StringBuilder();
		sql.append("select new map(iso_year(r.occurTime) as year, iso_week(r.occurTime) as week,");
		sql.append("sum(case when r.category.type=:outlay then r.amount else 0 end) as total");
		for (Category category : categories) {
			params.put("c" + category.getId(), category);
			sql.append(",sum(case when r.category=:c");
			sql.append(category.getId());
			sql.append(" then r.amount else 0 end) as c");
			sql.append(category.getId());
		}
		sql.append(") from Record r where r.occurTime between :start and :end ");
		sql.append("group by iso_year(r.occurTime), iso_week(r.occurTime) order by year, week");
		return maps(sql.toString(), params);
	}

}
