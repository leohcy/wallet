package com.hedatou.wallet.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hedatou.wallet.dao.AccountDao;
import com.hedatou.wallet.domain.Account;

@Service
@Transactional(readOnly = true)
public class AccountService {

	@Autowired
	private AccountDao dao;

	public List<Account> displayed() {
		return dao.displayed();
	}

	public List<Account> sorted() {
		return dao.sorted();
	}

	@Transactional
	public void switchDisplay(long id) {
		Account account = dao.get(id);
		account.setDisplay(!account.getDisplay());
	}

	@Transactional
	public void setIncome(long id) {
		Account oldDefault = dao.defaultIncome();
		if (oldDefault != null)
			oldDefault.setDefaultIncome(false);
		Account newDefault = dao.get(id);
		if (newDefault != null)
			newDefault.setDefaultIncome(true);
	}

	@Transactional
	public void setOutlay(long id) {
		Account oldDefault = dao.defaultOutlay();
		if (oldDefault != null)
			oldDefault.setDefaultOutlay(false);
		Account newDefault = dao.get(id);
		if (newDefault != null)
			newDefault.setDefaultOutlay(true);
	}

}
