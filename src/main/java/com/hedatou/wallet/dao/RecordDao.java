package com.hedatou.wallet.dao;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.hibernate.sql.JoinType;
import org.springframework.stereotype.Repository;

import com.google.common.base.Strings;
import com.google.common.collect.ImmutableMap;
import com.hedatou.wallet.domain.Account.AccountType;
import com.hedatou.wallet.domain.Category.CategoryType;
import com.hedatou.wallet.domain.Record;
import com.hedatou.wallet.dto.GroupItem;

@Repository
public class RecordDao extends DaoSupport<Record> {

	public List<GroupItem> groupByCategory(CategoryType type, Date start,
			Date end) {
		String hql = "select new com.hedatou.wallet.dto.GroupItem"
				+ "(c.name as name, sum(r.amount) as amount)"
				+ " from Record r join r.category c"
				+ " where c.type=:type and r.occurTime between :start and :end"
				+ " group by c order by amount desc";
		return query(hql,
				ImmutableMap.of("type", type, "start", start, "end", end),
				false, GroupItem.class);
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
}
