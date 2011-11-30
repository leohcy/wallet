package com.hedatou.wallet.domain;

import javax.persistence.Cacheable;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
@Cacheable
public class OutlayRecord extends Record {

	private Account outlayAccount;

	@NotNull
	@ManyToOne
	public Account getOutlayAccount() {
		return outlayAccount;
	}

	public void setOutlayAccount(Account outlayAccount) {
		this.outlayAccount = outlayAccount;
	}

	@Override
	public String toString() {
		return String.format("[支出记录:%s/%s/%s]", getAmount(), getCategory(),
				outlayAccount);
	}

}
