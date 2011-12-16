package com.hedatou.wallet.web;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.hedatou.wallet.service.DatabaseService;

@Controller
@RequestMapping("database")
public class DatabaseController extends ControllerSupport {

	@Autowired
	private DatabaseService service;

	@RequestMapping("dbscript")
	public ResponseEntity<String> dbscript() {
		String dbscript = service.dbscript();
		HttpHeaders headers = new HttpHeaders();
		headers.set("Content-Type", "application/octet-stream; charset=utf-8");
		headers.set("Content-Disposition", String.format(
				"attachment; filename=\"dbscript_%s.sql\"", DateTime.now()
						.toString("YYYYMMddHHmm")));
		return new ResponseEntity<String>(dbscript, headers, HttpStatus.OK);
	}

	@RequestMapping("backup")
	public ResponseEntity<byte[]> backup() {
		byte[] backup = service.backup();
		HttpHeaders headers = new HttpHeaders();
		headers.set("Content-Type", "application/octet-stream");
		headers.set("Content-Disposition", String.format(
				"attachment; filename=\"backup_%s.zip\"", DateTime.now()
						.toString("YYYYMMddHHmm")));
		return new ResponseEntity<byte[]>(backup, headers, HttpStatus.OK);
	}

}
