<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="style/main.css">
</head>
<body id="admin">

<div id="page_loading">
    <span>No internet connection<br>Please try again...</span>
</div>

<header id="main_header">
    <a href="#" class="icon" id="menu_icon"></a>
    <a href="#" data-rel="back" data-direction="reverse" data-transition="slide" class="icon" id="back_icon"></a>
    <a href="#about" data-transition="pop" id="header_logo"></a>
    <div id="header_title"></div>
    <a href="#new_trend_1" data-transition="slide" class="icon" id="new_icon"></a>
</header>
<!--Login with account-->
<div data-role="page" id="login_with_account" data-title="Login with admin account">

    <div data-role="content">
        <div class="mini_container">
            <form>
                <div class="message red">Invalid username or password</div>
                <input type="text" id="login_username" placeholder="username" />
                <input type="password" id="login_password" placeholder="password" />
                <a href="#" class="button no_image red" data-role="disable" id="submit_login">Login</a>
            </form>
        </div>
    </div>

</div>
<!--/Login with account-->

<script src="/js/jquery_latest.js"></script>
<script src="/js/jquery_mobile.js"></script>
<script src="/js/jquery_cookie.js"></script>
<script src="/js/jquery_lazyload.js"></script>
<script src="/js/md5.js"></script>
<script src="js/all.js"></script>
</body>
</html>