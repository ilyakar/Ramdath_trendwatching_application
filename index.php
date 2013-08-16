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

<div data-role="page" id="home_page" data-title="Welcome to...">
	<section id="home_image">
        <div class="text">
            <p>live.</p>
            <p>explore.</p>
            <p>create.</p>
        </div>
        <div class="gradient"></div>
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
		<a href="#" id="login_with_facebook" data-transition="pop" class="button red no_image">login with facebook</a>
		<a href="#" id="login_with_google" class="button red no_image">login with google</a>
		<a href="#login_with_account" id="login_with_account_button" data-transition="pop" class="button no_image">username & password</a>
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
            <p id="register_p">No account? <a href="#register_1" data-transition="pop">Register now</a></p>
		</div>
	</div>

</div>
<!--/Login with account-->


<!--Register-->
<div data-role="page" id="register_1" data-title="Register your account | step 1">

	<div data-role="content">
		<div class="mini_container">
			<form>
                <label>General information</label>
				<input type="text" id="reg_first_name" placeholder="first name" />
				<input type="text" id="reg_last_name" placeholder="last name" />
				<input type="text" id="reg_username" placeholder="username" />
                <select class="custom_select" id="reg_gender">
                    <option value="" disabled="disabled" selected="selected">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <input type="password" id="reg_password" data-role="pass" data-pass-id="new_account_pass" placeholder="password" />
                <input type="password" id="reg_conf_password" data-role="conf-pass" data-pass-id="new_account_pass" placeholder="confirm password" />
                <a class="button no_image red" id="register_2_button" data-role="disable" data-transition="slide" href="#register_2">Next</a>
            </form>
		</div>
	</div>

</div>


<div data-role="page" id="register_2" data-title="Register your account | step 2">

    <div data-role="content">
        <div class="mini_container">
            <form>
                <label>Extra information</label>
                <input type="text" id="reg_email" placeholder="email" />
                <input type="text" id="reg_city" placeholder="city" />
                <input type="text" id="reg_country" placeholder="country" />
                <a class="button no_image red" id="register_3_button" data-role="disable" data-transition="slide" href="#register_3">Next</a>
            </form>
        </div>
    </div>

</div>

<div data-role="page" id="register_3" data-title="Register your account | step 3">
    <div data-role="content">
        <div class="mini_container">
            <form>
                <label>Date of birth</label>
                <fieldset class="date_of_birth">
                    <input type="text" id="reg_date_of_birth_1" maxlength="2" placeholder="DD" />
                    <input type="text" id="reg_date_of_birth_2" maxlength="2" placeholder="MM" />
                    <input type="text" id="reg_date_of_birth_3" maxlength="4" placeholder="YYYY" />
                </fieldset>
                <a class="button no_image red" id="submit_registration_button" data-role="disable" data-transition="slide" href="#">Complete registration</a>
            </form>
        </div>
    </div>
</div>
<!--/Register-->

<!--Edit account-->
<div data-role="page" id="edit_account" data-title="Editing your account">

    <div data-role="content">
        <div class="mini_container">
            <form id="edit_profile_form" method="post" enctype="multipart/form-data">

                <label>Profile image</label>
                <div class="thumbnail_upload">
                    <input type="file" id="edit_profile_image" name="profile_image" />
                    <img id="edit_profile_image_thumbnail" src="/style/images/default_profile_image.jpg" />
                    <span>Click to edit</span>
                </div>

                <label>General information</label>
                <input type="text" id="edit_username" placeholder="username" disabled />
                <input type="text" id="edit_first_name" placeholder="first name" />
                <input type="text" id="edit_last_name" placeholder="last name" />
                <select class="custom_select" id="edit_gender">
                    <option value="" selected="selected" disabled>Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <label>Extra information</label>
                <input type="text" id="edit_email" placeholder="email" />
                <input type="text" id="edit_city" placeholder="city" />
                <input type="text" id="edit_country" placeholder="country" />

                <label>Date of birth</label>
                <fieldset class="date_of_birth">
                    <input type="text" id="edit_date_of_birth_1" maxlength="2" placeholder="DD" />
                    <input type="text" id="edit_date_of_birth_2" maxlength="2" placeholder="MM" />
                    <input type="text" id="edit_date_of_birth_3" maxlength="4" placeholder="YYYY" />
                </fieldset>

                <label>Change password</label>
                <input type="password" id="edit_password_old" placeholder="old password" />
                <input type="password" id="edit_password" data-role="pass" data-pass-id="edit_account_pass" placeholder="password" />
                <input type="password" id="edit_conf_password" data-role="conf-pass" data-pass-id="edit_account_pass" placeholder="confirm password" />

                <a class="button no_image red" id="submit_account_edit_button" data-role="disable" data-transition="slide" href="#">Submit edit</a>

            </form>
        </div>
    </div>
</div>
<!--/Edit account-->

<!--Create stuff-->
<div data-role="page" id="create" data-title="CREATE">

	<div data-role="content">
		<div class="mini_container">
			<a href="#new_trend_1" class="button red" data-transition="slide" id="new_trend_1_button">New trend</a>
			<a href="#research_projects" data-transition="slide" class="button" id="my_research_projects_button">My research projects</a>
			<a href="#" class="button small" id="need_some_help_button">Need some help?</a>
		</div>
	</div>

</div>

<div data-role="page" id="new_trend_1" data-title="New trend | step 1">

	<div data-role="content">
		<div class="mini_container">

			<form action="/php/upload_images.php" class="dropzone" id="image-upload-dropzone"></form>
			<input id="uploaded_images_field" type="hidden" />
			<a href="#" class="button no_image two" data-rel="back">Back</a>
			<a href="#new_trend_2" class="button no_image red two" data-transition="slide" data-role="disable" id="new_trend_2_button">Step 2</a>

		</div>
	</div>
</div>

<div data-role="page" id="new_trend_2" data-title="New trend | step 2">

    <div data-role="content">
        <div class="maxi_container margin">
            <form class="margin">
                <label>Title</label>
                <input type="text" placeholder="title" id="new_trend_title" />
                <label>Description</label>
                <textarea id="new_trend_description" placeholder="description"></textarea>
                <label>Video link <span>Youtube or Vimeo</span></label>
                <input type="text" placeholder="http://" id="new_trend_video" />
                <label>Website link</label>
                <input type="text" placeholder="http://" id="new_trend_website" />
                <label>Trend location</label>
                <input type="text" id="new_trend_location" placeholder="trend location" />
            </form>
            <a href="#" class="button no_image two" data-rel="back">Back</a>
            <a href="#new_trend_3" class="button no_image red two" data-transition="slide" data-role="disable" id="new_trend_3_button">Step 3</a>
        </div>
    </div>

</div>

<div data-role="page" id="new_trend_3" data-title="New trend | step 3">

    <div data-role="content">
        <div class="maxi_container margin">
            <form class="margin">
                <label>Tags</label>
                <input id="new_trend_tagger" />
                <label>Categories</label>
                <div class="tags" id="new_trend_categories"></div>
                <label>Mentality trend</label>
                <select class="custom_select" id="new_trend_ment_trends">
                    <option value="" disabled="disabled" selected="selected">Trend</option>
                </select>
            </form>
            <a href="#" class="button no_image two" data-rel="back">Back</a>
            <a href="#" class="button no_image red two" data-role="disable" id="submit_new_trend">Submit trend</a>
        </div>
    </div>

</div>

<div data-role="page" id="research_projects" data-title="My research projects">

    <div data-role="content">
        <div class="maxi_container research_projects"></div>
    </div>

</div>


<div data-role="page" id="view_project" data-title="View project">
    <!--Populated dynamically-->
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
                <div class="tags" id="edit_trend_categories"></div>
                <label>Trend location</label>
                <input type="text" id="edit_trend_location" placeholder="trend location" />
                <input type="hidden" id="edit_trend_id" value="" />
            </form>
            <a href="#" class="button no_image two" data-rel="back">Back</a>
            <a href="#" class="button no_image red two" id="submit_edit_trend">Edit trend</a>
        </div>
    </div>

</div>
<!--/Workspace stuff-->

<!--Explore stuff-->
<div data-role="page" id="explore" data-title="EXPLORE">

    <div data-role="content">
        <div id="filter_by">
            <label>Filter posts by:</label>
            <a href="#" data-d-id="category">Category</a>
            <div data-d-id="category"></div>

            <a href="#" data-d-id="popularity">Popularity</a>
            <div data-d-id="popularity">
                <ul>
                    <li><a href="#">Views</a></li>
                </ul>
                <ul>
                    <li><a href="#">Rating</a></li>
                </ul>
                <ul>
                    <li><a href="#">Discussions</a></li>
                </ul>
            </div>

            <a href="#" data-d-id="date">Date</a>
            <div data-d-id="date">
                <ul>
                    <li><a href="#">Latest first</a></li>
                </ul>
                <ul>
                    <li><a href="#">Oldest first</a></li>
                </ul>
            </div>
        </div>
        <div id="image_list">
            <!-- Dynamically created -->
        </div>
        <div id="image_list_copy"></div>
    </div>

</div>

<div data-role="page" id="view_trend" data-title="View trend">
    <!--Populated dynamically-->
</div>

<!--/Explore stuff-->

<!--About page-->

<div data-role="page" id="about" data-title="ABOUT">
    <div data-role="content">
        <div class="maxi_container margin">
            <p>About page...</p>
        </div>
    </div>
</div>

<!--/About page-->

<!--Panel-->
<div id="settings_panel">
    <div>
        <div><img src="/style/images/default_profile_image.jpg" id="account_profile" alt="profile_pic"></div>
        <a href="#edit_account" data-transition="slide"><span id="account_username">John Doe</span> <span class="small">(edit)</span></a>
    </div>
<!--    <div>-->
<!--        <div></div>-->
<!--        <a href="#">Settings</a>-->
<!--    </div>-->
    <div>
        <div></div>
        <a href="#" id="logout_button">Logout</a>
    </div>
</div>
<!--/Panel-->
<div id="fb-root"></div>
<!-- /BODY  -->

<script> // FB stuff
    (function(d){
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement('script'); js.id = id; js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
    }(document));
</script>
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
<script src="js/md5.js"></script>
<script src="js/jquery_dropdown.js"></script>
<script src="js/jquery_simpleUpload.js"></script>
<script src="js/jquery_lazyload.js"></script>
<script src="js/tinymce/tinymce.min.js"></script>
<script src="js/masonry.js"></script>
<script src="https://maps.google.com/maps/api/js?sensor=false"></script>
</body>
</html>