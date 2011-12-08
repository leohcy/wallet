package com.hedatou.wallet.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.hedatou.wallet.domain.Category;

@Repository
public class CategoryDao extends DaoSupport<Category> {

	public List<Category> sorted() {
		return query("from Category c order by c.orderNo", false);
	}

}
