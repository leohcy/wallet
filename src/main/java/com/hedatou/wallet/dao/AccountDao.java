package com.hedatou.wallet.dao;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.hedatou.wallet.domain.Account;

@Repository
public class AccountDao extends DaoSupport<Account> {

	public List<Account> displayed() {
		return query("from Account a where a.display=true order by a.orderNo",
				false);
	}

	public List<Account> sorted() {
		return query("from Account a order by a.orderNo", false);
	}

	public Account defaultIncome() {
		return unique("from Account a where a.defaultIncome=true");
	}

	public Account defaultOutlay() {
		return unique("from Account a where a.defaultOutlay=true");
	}

	public int maxOrder() {
		return unique("select nvl(max(a.orderNo), 0) from Account a",
				Integer.class);
	}

	@SuppressWarnings("unchecked")
	public List<Account> between(int from, boolean includeFrom, int to,
			boolean includeTo) {
		Criteria criteria = criteria().addOrder(Order.asc("orderNo"));
		criteria.add(includeFrom ? Restrictions.ge("orderNo", from)
				: Restrictions.gt("orderNo", from));
		criteria.add(includeTo ? Restrictions.le("orderNo", to) : Restrictions
				.lt("orderNo", to));
		return criteria.list();
	}

	public BigDecimal total() {
		return unique("select sum(a.balance) from Account a", BigDecimal.class);
	}

}
