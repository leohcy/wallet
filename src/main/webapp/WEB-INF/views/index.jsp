<%@ page pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<title>我的账本</title>
		<style type="text/css">
		<link rel="stylesheet" type="text/css" href="/resources/ext-4.0.7/css/ext-all.css" />
#loading-mask { background-color:white; height:100%; position:absolute; left:0; top:0; width:100%; z-index:20000; }
#loading { height:auto; position:absolute; left:40%; top:40%; padding:2px; z-index:20001; }
#loading .loading-indicator { background:white; color:#444; font:bold 20px Helvetica, Arial, sans-serif; height:auto; margin:0; padding:10px; }
#loading-image { margin-right:8px; float:left; vertical-align:top; }
#loading-msg { font-size:14px; font-weight:normal; }
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
	    <div id="viewport"></div>
		<script type="text/javascript" src="/resources/ext-4.0.7/ext-all.js"></script>
		<script type="text/javascript" src="/resources/ext-4.0.7/ext-lang-zh_CN.js"></script>
		<script type="text/javascript">
Ext.onReady(function() {
	Ext.fly("loading").animate({ opacity:0, remove:true, duration:500 });
    Ext.fly("loading-mask").animate({ opacity:0, remove:true, duration:500 });
});
</script>
	</body>
</html>