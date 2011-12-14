package com.hedatou.wallet.dao;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.h2.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class DatabaseDao {

	@Autowired
	private JdbcTemplate jdbc;

	public String backup() {
		StringBuffer sb = new StringBuffer();
		Pattern regex = Pattern.compile("STRINGDECODE[(]'([^']*)'[)]");
		for (String line : jdbc.query("script simple",
				new SingleColumnRowMapper<String>())) {
			Matcher m = regex.matcher(line);
			while (m.find()) {
				String unicode = String.format("'%s'",
						StringUtils.javaDecode(m.group(1))).replace("$", "\\$");
				m.appendReplacement(sb, unicode);
			}
			m.appendTail(sb);
			sb.append("\n");
		}
		return sb.toString();
	}

}
