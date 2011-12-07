<%@page pageEncoding="utf-8" import="org.joda.time.DateTime"%>
<%request.setAttribute("now", org.joda.time.DateTime.now().toString("yyyy年MM月dd日"));%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<title></title>
		<link rel="icon" type="image/x-icon" href="/resources/images/logo.ico" />
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
.icon-income { background-image:url(/resources/images/coins_add.png) !important; }
.icon-outlay { background-image:url(/resources/images/coins_delete.png) !important; }
.icon-transfer { background-image:url(/resources/images/email_go.png) !important; }
.icon-record { background-image:url(/resources/images/book_addresses.png) !important; }
.icon-week-stats { background-image:url(/resources/images/chart_pie.png) !important; }
.icon-month-stats { background-image:url(/resources/images/chart_bar.png) !important; }
.icon-assets-stats { background-image:url(/resources/images/chart_line.png) !important; }
.icon-account { background-image:url(/resources/images/report.png) !important; }
.icon-category { background-image:url(/resources/images/color_swatch.png) !important; }
.icon-database { background-image:url(/resources/images/database_gear.png) !important; }
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
			<div id="header-title"></div><div id="header-date">${now}</div>
		</div>
		<div id="footer">和大头 &copy; 2011</div>
		<script type="text/javascript" src="/resources/ext-4.0.7/ext-all.js"></script>
		<script type="text/javascript" src="/resources/ext-4.0.7/ext-lang-zh_CN.js"></script>
		<script type="text/javascript" src="/resources/scripts/wallet.js"></script>
		<script type="text/javascript">
Ext.onReady(function() {
    Ext.create("Wallet.View");
	Ext.fly("loading").animate({ opacity:0, remove:true, duration:800 });
    Ext.fly("loading-mask").animate({ opacity:0, remove:true, duration:400 });
});
</script>
	</body>
</html>