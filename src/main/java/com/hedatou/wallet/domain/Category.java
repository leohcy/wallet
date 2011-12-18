package com.hedatou.wallet.domain;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Category extends Domain {

	public enum CategoryType {
		收入, 支出, 转账
	}

	@NotEmpty
	@Length(max = 32)
	@Column(unique = true)
	private String name;
	@NotNull
	private CategoryType type;
	@NotNull
	@Digits(integer = 6, fraction = 2)
	@Min(0)
	private BigDecimal total;
	@NotNull
	private Boolean defaults;
	@NotNull
	private Boolean checks;
	@Length(max = 128)
	private String description;
	@NotNull
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm")
	@Temporal(TemporalType.TIMESTAMP)
	private Date lastUpdate;
	@NotNull
	private Integer orderNo;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public CategoryType getType() {
		return type;
	}

	public void setType(CategoryType type) {
		this.type = type;
	}

	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}

	public Boolean getDefaults() {
		return defaults;
	}

	public void setDefaults(Boolean defaults) {
		this.defaults = defaults;
	}

	public Boolean getChecks() {
		return checks;
	}

	public void setChecks(Boolean checks) {
		this.checks = checks;
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

	public Integer getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(Integer orderNo) {
		this.orderNo = orderNo;
	}

	@Override
	public String toString() {
		return String.format("[分类:%s/%s]", name, total);
	}

}
