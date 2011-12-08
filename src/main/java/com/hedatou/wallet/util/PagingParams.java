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

	public void setTotal(long total) {
		Preconditions.checkArgument(total >= 0,
				"paging param total must not be negative: %s", total);
		holder.get().put("total", total);
	}

	public int getStart() {
		Number start = holder.get().get("start");
		Preconditions.checkState(start != null,
				"paging parameters not initialized yet");
		return start.intValue();
	}

	public int getLimit() {
		Number limit = holder.get().get("limit");
		Preconditions.checkState(limit != null,
				"paging parameters not initialized yet");
		return limit.intValue();
	}

	public long getTotal() {
		Number total = holder.get().get("total");
		Preconditions.checkState(total != null,
				"total count not calculated yet");
		return total.longValue();
	}

	public void finish() {
		holder.remove();
	}

}
