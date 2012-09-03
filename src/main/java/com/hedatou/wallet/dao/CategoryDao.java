package com.hedatou.wallet.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.hedatou.wallet.domain.Category;
import com.hedatou.wallet.domain.Category.CategoryType;

@Repository
public class CategoryDao extends DaoSupport<Category> {

	public List<Category> sorted() {
		return query("from Category c order by c.orderNo", false);
	}

	public List<Category> byType(CategoryType type) {
		return query("from Category c where c.type=:type order by c.orderNo",
				"type", type, false);
	}

	public Category defaultsByType(CategoryType type) {
		return unique("from Category c where c.type=:type and c.defaults=true",
				"type", type);
	}

	public Category checksByType(CategoryType type) {
		return unique("from Category c where c.type=:type and c.checks=true",
				"type", type);
	}

	public int maxOrder() {
		return unique("select nvl(max(c.orderNo), 0) from Category c",
				Integer.class);
	}

	@SuppressWarnings("unchecked")
	public List<Category> between(int from, boolean includeFrom, int to,
			boolean includeTo) {
		Criteria criteria = criteria().addOrder(Order.asc("orderNo"));
		criteria.add(includeFrom ? Restrictions.ge("orderNo", from)
				: Restrictions.gt("orderNo", from));
		criteria.add(includeTo ? Restrictions.le("orderNo", to) : Restrictions
				.lt("orderNo", to));
		return criteria.list();
	}

}
