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

}
