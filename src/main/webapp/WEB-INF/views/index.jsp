<%@page pageEncoding="utf-8" import="org.joda.time.DateTime"%>
<%request.setAttribute("now", DateTime.now().toString("yyyy年MM月dd日"));%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<meta name="robots" content="noindex,nofollow" />
		<title>我的账本</title>
		<link rel="stylesheet" type="text/css" href="/resources/ext-4.0.7/css/ext-all.css" />
		<style type="text/css">
#loading-mask { background-color:white; height:100%; position:absolute; left:0; top:0; width:100%; z-index:20000; }
#loading { height:auto; position:absolute; left:40%; top:40%; padding:2px; z-index:20001; }
#loading .loading-indicator { background:white; color:#444; font:bold 20px Helvetica, Arial, sans-serif; height:auto; margin:0; padding:10px; }
#loading-image { margin-right:8px; float:left; vertical-align:top; }
#loading-msg { font-size:14px; font-weight:normal; }
#header { background:#DFE8F6 url(/resources/images/logo.png) no-repeat 24px; height:48px; }
#header-title { float:left; height:48px; line-height:48px; margin-left:96px; font-size:32px; font-weight:bold; color:#354854; }
#header-date { float:right; margin-top:28px; font-size:12px; font-weight:bold; }
#footer { background:#DFE8F6; text-align:center; font-size:12px; }

.menu-button .x-btn-inner { font-size:14px; font-weight:bold; }
.x-grid-row-summary .x-grid-cell-inner { font-size:12px; font-weight:bold; }
.statistics { color:blue; }
.positive { color:green; }
.negative { color:red; }
.icon-income { background-image:url(/resources/images/coins_add.png) !important; }
.icon-outlay { background-image:url(/resources/images/coins_delete.png) !important; }
.icon-transfer { background-image:url(/resources/images/email_go.png) !important; }
.icon-record { background-image:url(/resources/images/book_addresses.png) !important; }
.icon-week-stats { background-image:url(/resources/images/chart_pie.png) !important; }
.icon-month-stats { background-image:url(/resources/images/chart_bar.png) !important; }
.icon-asset-stats { background-image:url(/resources/images/chart_line.png) !important; }
.icon-account { background-image:url(/resources/images/report.png) !important; }
.icon-category { background-image:url(/resources/images/color_swatch.png) !important; }
.icon-database { background-image:url(/resources/images/database_gear.png) !important; }
.icon-console { background-image:url(/resources/images/application_osx_terminal.png) !important; }
.icon-script { background-image:url(/resources/images/script.png) !important; }
.icon-download { background-image:url(/resources/images/disk.png) !important; }
.icon-reload { background-image:url(/resources/images/arrow_refresh.png) !important; }
.icon-query { background-image:url(/resources/images/magnifier.png) !important; }
.icon-week { background-image:url(/resources/images/application_form_magnify.png) !important; }
.icon-month { background-image:url(/resources/images/date_magnify.png) !important; }
.icon-reset { background-image:url(/resources/images/control_repeat_blue.png) !important; }
.icon-confirm { background-image:url(/resources/images/tick.png) !important; }
.icon-cancel { background-image:url(/resources/images/cross.png) !important; }
.icon-add { background-image:url(/resources/images/calculator_add.png) !important; }
.icon-update { background-image:url(/resources/images/calculator_edit.png) !important; }
.icon-remove { background-image:url(/resources/images/calculator_delete.png) !important; }
.icon-show-hide { background-image:url(/resources/images/eye.png) !important; }
.icon-defaults { background-image:url(/resources/images/wrench.png) !important; }
.icon-checks { background-image:url(/resources/images/wrench_orange.png) !important; }
</style>
	</head>
	<body>
		<div id="loading-mask"></div>
	    <div id="loading">
	        <div class="loading-indicator">
	            <img id="loading-image" src="/resources/images/loading.gif" width="60" height="60" />
	            我的账本<br /><span id="loading-msg">初始化...</span>
	        </div>
	    </div>
		<div id="header">
			<div id="header-title"> 我的账本</div><div id="header-date">${now}</div>
		</div>
		<div id="footer">和大头 &copy; 2011</div>
		<script type="text/javascript" src="/resources/ext-4.0.7/ext-all-debug.js"></script>
		<script type="text/javascript" src="/resources/ext-4.0.7/ext-lang-zh_CN.js"></script>
		<script type="text/javascript">
Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.Loader.setConfig({
        enabled: true,
        paths: {
        	wallet: "/resources/scripts"
       	}
    });
	window.app = Ext.create("wallet.app");
	Ext.fly("loading").animate({ opacity:0, remove:true, duration:800 });
    Ext.fly("loading-mask").animate({ opacity:0, remove:true, duration:400 });
});
</script>
	</body>
</html>