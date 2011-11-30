package com.hedatou.wallet.domain;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
@Cacheable
public class IncomeRecord extends Record {

	private Account incomeAccount;

	@NotNull
	@ManyToOne
	public Account getIncomeAccount() {
		return incomeAccount;
	}

	public void setIncomeAccount(Account incomeAccount) {
		this.incomeAccount = incomeAccount;
	}

	@Override
	public String toString() {
		return String.format("[收入记录:%s/%s/%s]", getAmount(), getCategory(),
				incomeAccount);
	}

}
