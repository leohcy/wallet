package com.hedatou.wallet.domain;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class IncomeRecord extends Record {

	@NotNull
	@ManyToOne
	@Fetch(FetchMode.SELECT)
	private Account incomeAccount;

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
