package com.hedatou.wallet.dao;

import java.util.List;

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

}
