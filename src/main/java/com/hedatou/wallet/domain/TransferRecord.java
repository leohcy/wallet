package com.hedatou.wallet.domain;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
@Cacheable
public class TransferRecord extends Record {

	private Account fromAccount;
	private Account toAccount;

	@NotNull
	@ManyToOne
	public Account getFromAccount() {
		return fromAccount;
	}

	public void setFromAccount(Account fromAccount) {
		this.fromAccount = fromAccount;
	}

	@NotNull
	@ManyToOne
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
