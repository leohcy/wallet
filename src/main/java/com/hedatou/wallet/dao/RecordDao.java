package com.hedatou.wallet.dao;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.google.common.collect.ImmutableMap;
import com.hedatou.wallet.domain.Category.CategoryType;
import com.hedatou.wallet.domain.Record;
import com.hedatou.wallet.dto.Pair;

@Repository
public class RecordDao extends DaoSupport<Record> {

	public List<Pair> groupByCategory(CategoryType type, Date start, Date end) {
		String hql = "select new com.hedatou.wallet.dto.Pair"
				+ "(c.name as name, sum(r.amount) as amount)"
				+ " from Record r join r.category c"
				+ " where c.type=:type and r.occurTime between :start and :end"
				+ " group by c order by amount desc";
		return query(hql,
				ImmutableMap.of("type", type, "start", start, "end", end),
				false, Pair.class);
	}

}
