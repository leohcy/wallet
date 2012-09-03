package com.hedatou.wallet.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hedatou.wallet.dao.CategoryDao;
import com.hedatou.wallet.domain.Category;
import com.hedatou.wallet.domain.Category.CategoryType;
import com.hedatou.wallet.util.MessageSourceException;

@Service
@Transactional
public class CategoryService {

	@Autowired
	private CategoryDao dao;

	@Transactional(readOnly = true)
	public List<Category> sorted() {
		return dao.sorted();
	}

	@Transactional(readOnly = true)
	public List<Category> byType(CategoryType type) {
		return dao.byType(type);
	}

	public void defaults(long id) {
		Category newDefault = dao.get(id);
		Category oldDefault = dao.defaultsByType(newDefault.getType());
		if (newDefault != null)
			newDefault.setDefaults(true);
		if (oldDefault != null)
			oldDefault.setDefaults(false);
	}

	public void checks(long id) {
		Category newCheck = dao.get(id);
		if (CategoryType.转账.equals(newCheck.getType()))
			throw new MessageSourceException(
					"transferCategory.cannot.set.check");
		Category oldCheck = dao.checksByType(newCheck.getType());
		if (newCheck != null)
			newCheck.setChecks(true);
		if (oldCheck != null)
			oldCheck.setChecks(false);
	}

	public void save(Category category) {
		category.setTotal(new BigDecimal(0));
		category.setLastUpdate(new Date());
		category.setDefaults(false);
		category.setChecks(false);
		category.setOrderNo(dao.maxOrder());
		dao.save(category);
	}

	public void update(Category category) {
		Category old = dao.get(category.getId());
		category.setType(old.getType());
		category.setTotal(old.getTotal());
		category.setLastUpdate(new Date());
		category.setDefaults(old.getDefaults());
		category.setChecks(old.getChecks());
		category.setOrderNo(old.getOrderNo());
		dao.merge(category);
	}

	public void remove(long id) {
		dao.delete(id);
	}

	public void sort(long source, long target, boolean before) {
		int from = dao.get(source).getOrderNo(), to = dao.get(target)
				.getOrderNo();
		if (from < to) {
			List<Category> categories = dao.between(from, true, to, !before);
			int tmp = categories.get(categories.size() - 1).getOrderNo();
			for (int i = categories.size() - 1; i > 0; i--)
				categories.get(i)
						.setOrderNo(categories.get(i - 1).getOrderNo());
			categories.get(0).setOrderNo(tmp);
		} else if (from > to) {
			List<Category> categories = dao.between(to, before, from, true);
			int tmp = categories.get(0).getOrderNo();
			for (int i = 0; i < categories.size() - 1; i++)
				categories.get(i)
						.setOrderNo(categories.get(i + 1).getOrderNo());
			categories.get(categories.size() - 1).setOrderNo(tmp);
		}
	}

}
