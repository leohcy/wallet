package com.hedatou.wallet.domain;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Cacheable
public class Account extends Domain {

	private String name;
	private AccountType type;
	private BigDecimal balance;
	private Boolean defaultIncome;
	private Boolean defaultOutlay;
	private Boolean display;
	private String description;
	private Date lastUpdate;
	private Date createTime;
	private Integer order;

	@NotEmpty
	@Length(max = 32)
	@Column(unique = true)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@NotNull
	public AccountType getType() {
		return type;
	}

	public void setType(AccountType type) {
		this.type = type;
	}

	@NotNull
	@Digits(integer = 6, fraction = 2)
	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}

	@NotNull
	public Boolean getDefaultIncome() {
		return defaultIncome;
	}

	public void setDefaultIncome(Boolean defaultIncome) {
		this.defaultIncome = defaultIncome;
	}

	@NotNull
	public Boolean getDefaultOutlay() {
		return defaultOutlay;
	}

	public void setDefaultOutlay(Boolean defaultOutlay) {
		this.defaultOutlay = defaultOutlay;
	}

	@NotNull
	public Boolean getDisplay() {
		return display;
	}

	public void setDisplay(Boolean display) {
		this.display = display;
	}

	@Length(max = 128)
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@NotNull
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	@Temporal(TemporalType.TIMESTAMP)
	public Date getLastUpdate() {
		return lastUpdate;
	}

	public void setLastUpdate(Date lastUpdate) {
		this.lastUpdate = lastUpdate;
	}

	@NotNull
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	@Temporal(TemporalType.TIMESTAMP)
	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	@NotNull
	@Column(name = "orderNumber")
	public Integer getOrder() {
		return order;
	}

	public void setOrder(Integer order) {
		this.order = order;
	}

	@Override
	public String toString() {
		return String.format("[账户:%s/%s]", name, balance);
	}

}
