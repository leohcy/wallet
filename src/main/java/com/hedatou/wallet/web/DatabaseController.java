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

	@RequestMapping("backup")
	public ResponseEntity<String> backup() {
		String filename = String.format("backup_%s.sql", DateTime.now()
				.toString("YYYYMMddHHmm"));
		String backup = service.backup();
		HttpHeaders headers = new HttpHeaders();
		headers.set("Content-Type", "application/octet-stream; charset=utf-8");
		headers.set("Content-Disposition",
				String.format("attachment; filename=\"%s\"", filename));
		headers.setContentDispositionFormData("download", filename);
		return new ResponseEntity<String>(backup, headers, HttpStatus.OK);
	}

}
