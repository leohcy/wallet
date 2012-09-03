package com.hedatou.wallet.util;

import org.hibernate.dialect.H2Dialect;
import org.hibernate.dialect.function.StandardSQLFunction;
import org.hibernate.type.StandardBasicTypes;

public class H2ExtDialect extends H2Dialect {

	public H2ExtDialect() {
		super();
		registerFunction("nvl", new StandardSQLFunction("nvl"));
		registerFunction("iso_week", new StandardSQLFunction("iso_week",
				StandardBasicTypes.INTEGER));
		registerFunction("iso_year", new StandardSQLFunction("iso_year",
				StandardBasicTypes.INTEGER));
	}

}
