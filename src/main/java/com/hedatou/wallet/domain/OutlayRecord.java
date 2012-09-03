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
public class OutlayRecord extends Record {

	@NotNull
	@ManyToOne
	@Fetch(FetchMode.SELECT)
	private Account outlayAccount;

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
