package com.hedatou.wallet.domain;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Cacheable
public class Category extends Domain {

	private String name;
	private CategoryType type;
	private BigDecimal total;
	private Boolean defaults;
	private Boolean checks;
	private String description;
	private Date lastUpdate;
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
	public CategoryType getType() {
		return type;
	}

	public void setType(CategoryType type) {
		this.type = type;
	}

	@NotNull
	@Digits(integer = 6, fraction = 2)
	@Min(0)
	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}

	@NotNull
	public Boolean getDefaults() {
		return defaults;
	}

	public void setDefaults(Boolean defaults) {
		this.defaults = defaults;
	}

	@NotNull
	public Boolean getChecks() {
		return checks;
	}

	public void setChecks(Boolean checks) {
		this.checks = checks;
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
	@Column(name = "orderNumber")
	public Integer getOrder() {
		return order;
	}

	public void setOrder(Integer order) {
		this.order = order;
	}

	@Override
	public String toString() {
		return String.format("[分类:%s/%s]", name, total);
	}

}
