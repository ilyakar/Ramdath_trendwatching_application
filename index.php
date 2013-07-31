<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="style/main.css">
</head>
<body>

<!--  BODY  -->

<div id="page_loading"></div>

<header id="main_header">
	<a href="#" class="icon" id="menu_icon"></a>
    <a href="#" data-rel="back" data-transition="slide" class="icon" id="back_icon_create"></a>
    <a href="#explore" data-transition="slide"data-direction="reverse" class="icon" id="back_icon_explore"></a>
	<div id="header_logo"></div>
    <div id="header_title"></div>
	<a href="#new_idea_1" data-transition="slide" class="icon" id="new_icon"></a>
</header>

<div data-role="page" id="home_page" data-title="Welcome to...">
	<section id="home_image">
        <img src="/style/images/home_screen_image/images/1.jpg" alt="home_image" />
        <img src="/style/images/home_screen_image/images/2.jpg" alt="home_image" />
        <img src="/style/images/home_screen_image/images/3.jpg" alt="home_image" />
        <img src="/style/images/home_screen_image/images/4.jpg" alt="home_image" />
        <img src="/style/images/home_screen_image/images/5.jpg" alt="home_image" />
	</section>
</div>

<footer id="main_footer">
	<a href="#create" class="button uppercase" id="create_button">create<span>start finding trends</span></a>
	<a href="#explore" class="button uppercase" id="explore_button">explore<span>explore new trends</span></a>
	<section id="login">
		<a href="#create" id="login_with_facebook" data-transition="pop" class="button red no_image">login with facebook</a>
		<a href="#" id="login_with_google" class="button red no_image">login with google</a>
		<a href="#login_with_account" id="login_with_account_button" data-transition="pop" class="button no_image">login with account</a>
	</section>
</footer>

<!--Login with account-->
<div data-role="page" id="login_with_account" data-title="Login with account">

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


<!--Register-->
<div data-role="page" id="register_1" data-title="Register your account | step 1">

	<div data-role="content">
		<div class="mini_container">
			<form>
				<input type="text" id="reg_first_name" placeholder="first name" />
				<input type="text" id="reg_last_name" placeholder="last name" />
				<input type="text" id="reg_username" placeholder="username" />
				<a class="button no_image red" id="register_2_button" data-role="disable" data-transition="slide" href="#register_2">Next</a>
			</form>
		</div>
	</div>

</div>

<div data-role="page" id="register_2" data-title="Register your account | step 2">

	<div data-role="content">
		<div class="mini_container">
			<form>
				<input type="password" id="reg_date_of_birth" placeholder="Date of birth" />
				<select class="custom_select" id="reg_gender">
					<option value="" disabled="disabled" selected="selected">Gender</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
				</select>
				<input type="password" id="reg_password" placeholder="password" />
				<input type="password" id="reg_conf_password" placeholder="confirm password" />
				<a class="button no_image red" id="register_3_button" data-role="disable" data-transition="slide" href="#register_3">Next</a>
			</form>
		</div>
	</div>

</div>

<div data-role="page" id="register_3" data-title="Register your account | step 3">

	<div data-role="content">
		<div class="mini_container">
			<form>
				<input type="text" id="reg_email" placeholder="email" />
				<input type="text" id="reg_city" placeholder="city" />
				<input type="text" id="reg_country" placeholder="country" />
				<a class="button no_image red" id="finish_registration_button" data-role="disable" data-transition="slide" href="#create">Complete registration</a>
			</form>
		</div>
	</div>

</div>
<!--/Register-->

<!--Create stuff-->
<div data-role="page" id="create" data-title="CREATE">

	<div data-role="content">
		<div class="mini_container">
			<a href="#new_idea_1" class="button red" data-transition="slide" id="new_idea_1_button">New idea</a>
			<a href="#research_projects" class="button" id="my_research_projects_button">My research projects</a>
			<a href="#" class="button small" id="need_some_help_button">Need some help?</a>
		</div>
	</div>

</div>

<div data-role="page" id="new_idea_1" data-title="New idea | step 1">

	<div data-role="content">
		<div class="mini_container">

			<form action="/php/upload_images.php" class="dropzone" id="image-upload-dropzone"></form>
			<input id="uploaded_images_field" type="hidden" />
			<a href="#" class="button no_image two" data-rel="back">Back</a>
			<a href="#new_idea_2" class="button no_image red two" data-transition="slide" data-role="disable" id="new_idea_2_button">Next</a>

		</div>
	</div>
</div>

<div data-role="page" id="new_idea_2" data-title="New idea | step 2">

	<div data-role="content">
		<div class="maxi_container margin">
			<form class="margin">
				<label>General information</label>
                <input type="text" placeholder="title" id="new_idea_title" />
				<textarea id="new_idea_description" placeholder="description"></textarea>
				<input id="new_idea_tagger" />
				<label>Trend categories</label>
				<div class="tags trend_categories"></div>
				<label>Trend location</label>
			    <input type="text" class="trend_location" placeholder="trend location" />
			</form>
			<a href="#" class="button no_image two" data-rel="back">Back</a>
			<a href="#" class="button no_image red two" data-role="disable" id="submit_new_idea">Submit idea</a>
		</div>
	</div>

</div>

<div data-role="page" id="research_projects" data-title="My research projects">

    <div data-role="content">
        <div class="maxi_container research_projects"></div>
    </div>

</div>
<!--/Create stuff-->

<!--Workspace stuff-->
<div data-role="page" id="edit_trend" data-title="Edit trend">

    <div data-role="content">
        <div class="maxi_container margin">
            <form class="margin">
                <label>General information</label>
                <input type="text" placeholder="title" id="edit_trend_title" />
                <textarea id="edit_trend_description" placeholder="description"></textarea>
                <input id="edit_trend_tagger" />
                <label>Trend categories</label>
                <div class="tags trend_categories"></div>
                <label>Trend location</label>
                <input type="text" class="trend_location" placeholder="trend location" />
            </form>
            <a href="#" class="button no_image two" data-rel="back">Back</a>
            <a href="#" class="button no_image red two" data-role="disable" id="submit_new_idea">Submit idea</a>
        </div>
    </div>

</div>
<!--/Workspace stuff-->

<div data-role="page" id="new_idea_finished_submit" data-title="Thank you for submitting your idea">

    <div data-role="content">
        <div class="mini_container">
            Thank you
        </div>
    </div>

</div>

<!--Explore stuff-->
<div data-role="page" id="explore" data-title="EXPLORE">

    <div data-role="content">
        <div id="filter_by">
            <label>Filter posts by:</label>
            <a href="#">Category</a>
            <a href="#">Popularity</a>
            <a href="#">Date</a>
        </div>
        <div id="image_list">
            <!-- Dynamically created -->
        </div>
    </div>

</div>

<!--/Explore stuff-->

<!--Panel-->
<div id="settings_panel">
    <div>
        <div><img src="/images/6G89cMRfKKu4caP9MdNWrIhMF.jpeg" alt="profile_pic"></div>
        <a href="#">Ilya Karnaukhov <span>(edit)</span></a>
    </div>
    <div>
        <div></div>
        <a href="#">Settings</a>
    </div>
</div>
<!--/Panel-->

<!-- /BODY  -->

<script src="js/jquery_latest.js"></script>
<script src="js/all.js"></script>
<script src="js/jquery_mobile.js"></script>
<script src="js/jquery_cookie.js"></script>
<script src="js/dropzone.js"></script>
<script src="js/custom_select.js"></script>
<script src="js/jquery_tags.js"></script>
<script src="js/jquery_mousewheel.js"></script>
<script src="js/jquery_smoothDivScroll.js"></script>
<script src="js/jquery_easing.js"></script>
<script src="js/jquery_raty.js"></script>
<script src="js/jquery_comments.js"></script>
<script src="js/geolocation.js"></script>
<script src="https://maps.google.com/maps/api/js?sensor=false"></script>
</body>
</html>