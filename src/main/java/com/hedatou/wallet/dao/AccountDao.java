package com.hedatou.wallet.dao;

import java.util.List;

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

}
