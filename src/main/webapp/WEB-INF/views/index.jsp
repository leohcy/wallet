<%@page pageEncoding="utf-8" import="org.joda.time.DateTime"%>
<%request.setAttribute("now", org.joda.time.DateTime.now().toString("yyyy年MM月dd日"));%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<title>我的账本</title>
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
			<div id="header-title">我的账本</div><div id="header-date">${now}</div>
		</div>
		<div id="footer">和大头 &copy; 2011</div>
		<script type="text/javascript" src="/resources/ext-4.0.7/ext-all.js"></script>
		<script type="text/javascript" src="/resources/ext-4.0.7/ext-lang-zh_CN.js"></script>
		<script type="text/javascript">
Ext.onReady(function() {
	Ext.fly("loading").animate({ opacity:0, remove:true, duration:800 });
    Ext.fly("loading-mask").animate({ opacity:0, remove:true, duration:400 });
    init();
});

function init() {
	var menu = Ext.create("Ext.menu.Menu", {
		region: "west",
		margin: "5 0 5 5",
		plain: true,
		floating: false,
		defaults: {
			xtype: "buttongroup",
			margin: "2",
			columns: 1,
			defaults: {
				xtype: "button",
				scale: "medium",
				margin: "2",
				width: 120
			}
		},
		items: [ {
				title: "记账",
				items: [
					{ text: "1" },
					{ text: "2" },
					{ text: "3" }
				]
			}, {
				title: "统计",
				items: [
					{ text: "4" },
					{ text: "5" },
					{ text: "6" }
				]
			}, {
				title: "管理",
				items: [
					{ text: "7" },
					{ text: "8" },
					{ text: "9" }
				]
			}
		]
	});
	Ext.create("Ext.container.Viewport", {
		layout: "border",
		items: [ {
				region: "north",
				margin: "5 5 0 5",
				border: false,
				contentEl: "header"
			}, {
				region: "south",
				margin: "0 5 5 5",
				border: false,
				contentEl: "footer"
			}, {
				region: "center",
				margin: "5",
				html: "CENTER"
			},
			menu
		]
	});
}
</script>
	</body>
</html>