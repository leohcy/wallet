package com.hedatou.wallet.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hedatou.wallet.dao.DatabaseDao;
import com.hedatou.wallet.util.MessageSourceException;

@Service
public class DatabaseService {

	@Autowired
	private DatabaseDao dao;

	public String dbscript() {
		return dao.dbscript();
	}

	public byte[] backup() {
		try {
			return dao.backup();
		} catch (IOException e) {
			throw new MessageSourceException("backup.failure", e);
		}
	}

}
