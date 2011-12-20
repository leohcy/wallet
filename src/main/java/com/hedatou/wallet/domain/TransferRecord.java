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
public class TransferRecord extends Record {

	@NotNull
	@ManyToOne
	@Fetch(FetchMode.SELECT)
	private Account fromAccount;
	@NotNull
	@ManyToOne
	@Fetch(FetchMode.SELECT)
	private Account toAccount;

	public Account getFromAccount() {
		return fromAccount;
	}

	public void setFromAccount(Account fromAccount) {
		this.fromAccount = fromAccount;
	}

	public Account getToAccount() {
		return toAccount;
	}

	public void setToAccount(Account toAccount) {
		this.toAccount = toAccount;
	}

	@Override
	public String toString() {
		return String.format("[转账记录:%s/%s/%s/%s]", getAmount(), getCategory(),
				fromAccount, toAccount);
	}
}
