package com.hedatou.wallet.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hedatou.wallet.dao.CategoryDao;
import com.hedatou.wallet.domain.Category;
import com.hedatou.wallet.domain.Category.CategoryType;

@Service
@Transactional(readOnly = true)
public class CategoryService {

	@Autowired
	private CategoryDao dao;

	public List<Category> sorted() {
		return dao.sorted();
	}

	public List<Category> income() {
		return dao.byType(CategoryType.收入);
	}

	public List<Category> outlay() {
		return dao.byType(CategoryType.支出);
	}

	public List<Category> transfer() {
		return dao.byType(CategoryType.转账);
	}

}
