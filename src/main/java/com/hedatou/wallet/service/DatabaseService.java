package com.hedatou.wallet.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hedatou.wallet.dao.DatabaseDao;

@Service
public class DatabaseService {

	@Autowired
	private DatabaseDao dao;

	public String backup() {
		return dao.backup();
	}

}
