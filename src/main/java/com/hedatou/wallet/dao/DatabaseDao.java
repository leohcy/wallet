package com.hedatou.wallet.dao;

import java.io.File;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.h2.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;

import com.google.common.io.Files;

@Repository
public class DatabaseDao {

	@Autowired
	private JdbcTemplate jdbc;
	private File backupDir;

	@Value("${db}")
	public void setBackupDir(File dbFile) {
		this.backupDir = dbFile.getParentFile();
	}

	public String dbscript() {
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

	public byte[] backup() throws IOException {
		File backup = new File(backupDir, String.format("backup_%d.zip",
				System.currentTimeMillis()));
		jdbc.update("backup to ?", backup.getPath());
		backup.deleteOnExit();
		return Files.toByteArray(backup);
	}

}
