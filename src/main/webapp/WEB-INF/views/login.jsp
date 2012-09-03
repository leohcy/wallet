<%@page pageEncoding="utf-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<meta name="robots" content="noindex,nofollow" />
		<title>我的账本 &rsaquo; 登录</title>
		<style type="text/css">
#login { width:280px; padding:114px 0 0; margin:auto; }
#login h1 { text-align:center; height:48px; background:url(/resources/images/logo.png) no-repeat; }
#login form { padding:26px 24px 46px; border:1px solid #E5E5E5; border-radius:6px; box-shadow: rgba(200,200,200,0.7) 0 4px 10px -1px; }
#login label { color:#777; font-size:14px; }
#login .input { width:100%; font-size:24px; border-radius:3px; }
#login .submit { float:right; padding:3px 10px; border:1px solid #298CBA; background:#21759B; border-radius:11px; box-sizing:content-box; color:white; cursor:pointer; }
</style>
	</head>
	<body>
		<div id="login">
			<h1>我的账本</h1>
			<form method="post">
				<p>
					<label for="username">用户名</label><br/>
					<input type="text" class="input" id="username" name="username" />
				</p>
				<p>
					<label for="password">密码</label><br/>
					<input type="password" class="input" id="password" name="password" />
				</p>
				<p>
					<input type="checkbox" id="rememberMe" name="rememberMe" />
					<label for="rememberMe">记住我的登录信息</label>
					<input type="submit" class="submit" value="登录" />
				</p>
			</form>
		</div>
	</body>
</html>