package com.hedatou.wallet.domain;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Account extends Domain {

	@NotEmpty
	@Length(max = 32)
	@Column(unique = true)
	private String name;
	@NotNull
	private AccountType type;
	@NotNull
	@Digits(integer = 6, fraction = 2)
	private BigDecimal balance;
	@NotNull
	private Boolean defaultIncome;
	@NotNull
	private Boolean defaultOutlay;
	@NotNull
	private Boolean display;
	@Length(max = 128)
	private String description;
	@NotNull
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	@Temporal(TemporalType.TIMESTAMP)
	private Date lastUpdate;
	@NotNull
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	@Temporal(TemporalType.TIMESTAMP)
	private Date createTime;
	@NotNull
	private Integer orderNo;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public AccountType getType() {
		return type;
	}

	public void setType(AccountType type) {
		this.type = type;
	}

	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}

	public Boolean getDefaultIncome() {
		return defaultIncome;
	}

	public void setDefaultIncome(Boolean defaultIncome) {
		this.defaultIncome = defaultIncome;
	}

	public Boolean getDefaultOutlay() {
		return defaultOutlay;
	}

	public void setDefaultOutlay(Boolean defaultOutlay) {
		this.defaultOutlay = defaultOutlay;
	}

	public Boolean getDisplay() {
		return display;
	}

	public void setDisplay(Boolean display) {
		this.display = display;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getLastUpdate() {
		return lastUpdate;
	}

	public void setLastUpdate(Date lastUpdate) {
		this.lastUpdate = lastUpdate;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Integer getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(Integer orderNo) {
		this.orderNo = orderNo;
	}

	@Override
	public String toString() {
		return String.format("[账户:%s/%s]", name, balance);
	}

}
