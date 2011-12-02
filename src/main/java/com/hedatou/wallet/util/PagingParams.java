package com.hedatou.wallet.util;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.google.common.base.Preconditions;
import com.google.common.collect.Maps;

@Component
public class PagingParams {

	private ThreadLocal<Map<String, Number>> holder = new ThreadLocal<Map<String, Number>>() {
		protected Map<String, Number> initialValue() {
			return Maps.newHashMap();
		}
	};

	public void setStart(int start) {
		Preconditions.checkArgument(start >= 0,
				"paging param start must not be negative: %s", start);
		holder.get().put("start", start);
	}

	public void setLimit(int limit) {
		Preconditions.checkArgument(limit > 0,
				"paging param limit must be positive: %s", limit);
		holder.get().put("limit", limit);
	}

	public void setPageNo(int pageNo) {
		Preconditions.checkArgument(pageNo > 0,
				"paging param pageNo must be positive: %s", pageNo);
		holder.get().put("pageNo", pageNo);
	}

	public void setPageSize(int pageSize) {
		Preconditions.checkArgument(pageSize > 0,
				"paging param pageSize must be positive: %s", pageSize);
		holder.get().put("pageSize", pageSize);
	}

	public void setTotal(long total) {
		Preconditions.checkArgument(total >= 0,
				"paging param total must not be negative: %s", total);
		holder.get().put("total", total);
	}

	public int getStart() {
		Number start = holder.get().get("start");
		if (start != null)
			return start.intValue();
		Number pageNo = holder.get().get("pageNo");
		Number pageSize = holder.get().get("pageSize");
		Preconditions.checkState(pageNo != null && pageSize != null,
				"paging parameters not initialized yet");
		return (pageNo.intValue() - 1) * pageSize.intValue();
	}

	public int getLimit() {
		Number limit = holder.get().get("limit");
		if (limit != null)
			return limit.intValue();
		Number pageSize = holder.get().get("pageSize");
		Preconditions.checkState(pageSize != null,
				"paging parameters not initialized yet");
		return pageSize.intValue();
	}

	public long getTotal() {
		Number total = holder.get().get("total");
		Preconditions.checkState(total != null,
				"total count not calculated yet");
		return total.longValue();
	}

	public int getPageCount() {
		Number total = holder.get().get("total");
		Number pageSize = holder.get().get("pageSize");
		Preconditions.checkState(total != null && pageSize != null,
				"total count not calculated yet");
		return (int) ((total.longValue() + pageSize.intValue() - 1) / pageSize
				.intValue());
	}

	public void finish() {
		holder.remove();
	}

}
