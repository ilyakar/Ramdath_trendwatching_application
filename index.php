<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes" />
	<link rel="stylesheet" href="style/main.css">

    <!-- Fancybox stuff -->
    <link rel="stylesheet" href="/fancybox/jquery.fancybox.css?v=2.1.5" type="text/css" media="screen" />
    <link rel="stylesheet" href="/fancybox/helpers/jquery.fancybox-buttons.css?v=1.0.5" type="text/css" media="screen" />
    <link rel="stylesheet" href="/fancybox/helpers/jquery.fancybox-thumbs.css?v=1.0.7" type="text/css" media="screen" />
    <!-- /Fancybox stuff -->
</head>
<body>

<!--  BODY  -->

<div id="page_loading">
    <span>No internet connection<br>Please try again...</span>
</div>

<div id="site_message">This is a site message</div>

<div id="add_to_homescreen">Add to homescreen</div>

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
	<a href="#create" class="button uppercase" id="create_button">create<span>start finding signs</span></a>
	<a href="#explore" class="button uppercase" id="explore_button">explore<span>explore new signs</span></a>
	<section id="login">
        <div class="container">
            <div class="subcontainer">
                <a href="#" id="login_with_facebook" data-transition="pop" class="button red no_image">login with facebook</a>
                <a href="#" id="login_with_google" class="button red no_image">login with google</a>
                <a href="#login_with_account" id="login_with_account_button" data-transition="pop" class="button no_image">username & password</a>
	        </div>
        </div>
    </section>
</footer>

<!--Login with account-->
<div data-role="page" id="login_with_account" data-title="Login with account">

	<div data-role="content">
		<div class="container">
            <div class="subcontainer">
                <form>
                    <input type="text" id="login_username" placeholder="username" />
                    <input type="password" id="login_password" placeholder="password" />
                    <a href="#" class="button no_image red" data-role="disable" id="submit_login">Login</a>
                </form>
                <p id="register_p">No account? <a href="#register_1" data-transition="pop">Register now</a></p>
            </div>
		</div>
	</div>

</div>
<!--/Login with account-->


<!--Register-->
<div data-role="page" id="register_1" data-title="Register your account | step 1">

	<div data-role="content">
		<div class="container">
            <div class="subcontainer">
                <form>
                    <label>General information</label>
                    <input type="text" id="reg_first_name" placeholder="first name" />
                    <input type="text" id="reg_last_name" placeholder="last name" />
                    <input type="text" id="reg_username" placeholder="username" data-form="no-tick" />
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

</div>


<div data-role="page" id="register_2" data-title="Register your account | step 2">

    <div data-role="content">
        <div class="container">
            <div class="subcontainer">
                <form>
                    <label>Extra information</label>
                    <input type="text" id="reg_email" placeholder="email" data-form="no-tick" />
                    <input type="text" id="reg_city" placeholder="city" />
                    <select id="reg_country" />
                        <option value="" disabled="disabled" selected="selected">country</option>
                    </select>
                    <a class="button no_image red" id="register_3_button" data-role="disable" data-transition="slide" href="#register_3">Next</a>
                </form>
            </div>
        </div>
    </div>

</div>

<div data-role="page" id="register_3" data-title="Register your account | step 3">
    <div data-role="content">
        <div class="container">
            <div class="subcontainer">
                <form>
                    <label>Date of birth</label>
                    <fieldset class="date_of_birth">
                        <input type="text" id="reg_date_of_birth_1" maxlength="2" placeholder="DD" data-form="no-tick" />
                        <input type="text" id="reg_date_of_birth_2" maxlength="2" placeholder="MM" data-form="no-tick" />
                        <input type="text" id="reg_date_of_birth_3" maxlength="4" placeholder="YYYY" data-form="no-tick" />
                    </fieldset>
                    <fieldset class="checkbox">
                        <input type="checkbox" id="reg_terms_of_service"><span>I agree and accept the </span><a href="#terms_of_service" data-transition="slide">Terms of Service</a>.
                    </fieldset>
                    <a class="button no_image red" id="submit_registration_button" data-role="disable" data-transition="slide" href="#">Complete registration</a>
                </form>
            </div>
        </div>
    </div>
</div>
<!--/Register-->

<!--Terms of Service -->
<div data-role="page" id="terms_of_service" data-title="Terms of service">

    <div data-role="content">
        <div class="container">
            <b>Legal Notices</b>

            <p>We, the Operators of this Website, provide it as a public service to our users.</p>

            <p>Please carefully review the following basic rules that govern your use of the Website. Please note that your use of the Website constitutes your unconditional agreement to follow and be bound by these Terms and Conditions of Use. If you (the "User") do not agree to them, do not use the Website, provide any materials to the Website or download any materials from them.</p>

            <p>The Operators reserve the right to update or modify these Terms and Conditions at any time without prior notice to User. Your use of the Website following any such change constitutes your unconditional agreement to follow and be bound by these Terms and Conditions as changed. For this reason, we encourage you to review these Terms and Conditions of Use whenever you use the Website.</p>

            <p>These Terms and Conditions of Use apply to the use of the Website and do not extend to any linked third party sites. These Terms and Conditions and our Privacy Policy, which are hereby incorporated by reference, contain the entire agreement (the “Agreement”) between you and the Operators with respect to the Website. Any rights not expressly granted herein are reserved.</p>
        </div>
    </div>

</div>
<!--/Terms of Service-->



<!--Edit account-->
<div data-role="page" id="edit_account" data-title="Editing your account">

    <div data-role="content">
        <div class="container">
            <div class="subcontainer">
                <form id="edit_profile_form" method="post" enctype="multipart/form-data">

                    <label>Profile image</label>
                    <div class="thumbnail_upload">
                        <input type="file" id="edit_profile_image" name="profile_image" />
                        <div>
                            <img id="edit_profile_image_thumbnail" src="/style/images/default_profile_image.jpg" />
                        </div>
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
                    <input type="text" id="edit_email" placeholder="email" data-form="no-tick" />
                    <input type="text" id="edit_city" placeholder="city" />
                    <select id="edit_country" />
                        <option value="" disabled="disabled" selected="selected">country</option>
                    </select>

                    <label>Date of birth</label>
                    <fieldset class="date_of_birth">
                        <input type="text" id="edit_date_of_birth_1" maxlength="2" placeholder="DD" data-form="no-tick" />
                        <input type="text" id="edit_date_of_birth_2" maxlength="2" placeholder="MM" data-form="no-tick" />
                        <input type="text" id="edit_date_of_birth_3" maxlength="4" placeholder="YYYY" data-form="no-tick" />
                    </fieldset>

                    <label>Change password</label>
                    <input type="password" id="edit_password_old" placeholder="current password" />
                    <input type="password" id="edit_password" data-role="pass" data-pass-id="edit_account_pass" placeholder="password" />
                    <input type="password" id="edit_conf_password" data-role="conf-pass" data-pass-id="edit_account_pass" placeholder="confirm password" />

                    <a class="button no_image red" id="submit_account_edit_button" data-role="disable" data-transition="slide" href="#">Submit edit</a>

                </form>
            </div>
        </div>
    </div>
</div>
<!--/Edit account-->

<!--Create stuff-->
<div data-role="page" id="create" data-title="CREATE">

	<div data-role="content">
		<div class="container">
            <div class="subcontainer">
                <a href="#new_trend_1" class="button red" data-transition="slide" id="new_trend_1_button">New sign</a>
                <a href="#research_projects" data-transition="slide" class="button" id="my_research_projects_button">My research projects</a>
                <a href="#" class="button small" id="need_some_help_button">Need some help?</a>
            </div>
		</div>
	</div>

</div>

<div data-role="page" id="new_trend_1" data-title="New sign | step 1">

	<div data-role="content">
		<div class="container">

            <div class="subcontainer">

                <!-- Desktop ver -->
                <form action="/php/upload_images.php" class="dropzone" id="image-upload-dropzone"></form>
                <input id="uploaded_images_field" type="hidden" />
                <!----------------->

                <!-- Mobile ver -->
                <div class="center">
                    <div id="mobile_trend_images_upload">
                        <form method="post" enctype="multipart/form-data">
                            <span>Add image</span>
                            <img src="" />
                            <input type="file" name="file" />
                            <a href="#">Remove image</a>
                        </form>
                    </div>
                </div>
                <!---------------->

                <a href="#" class="button no_image two" data-rel="back">Back</a>
                <a href="#new_trend_2" class="button no_image red two" data-transition="slide" data-role="disable" id="new_trend_2_button">Step 2</a>

            </div>

		</div>
	</div>
</div>

<div data-role="page" id="new_trend_2" data-title="New sign | step 2">

    <div data-role="content">
        <div class="container margin">
            <div class="subcontainer big">
                <form class="margin">
                    <label>Title</label>
                    <input type="text" placeholder="title" id="new_trend_title" />
                    <label>Description</label>
                    <textarea id="new_trend_description" placeholder="description">
                        <p><b>What it is</b></p>
                        <p>-</p>
                        <p><b>Why it is Cool</b></p>
                        <p>-</p>
                        <p><b>Why it has Future Growth Potential.</b></p>
                        <p>-</p>
                    </textarea>
                    <label>Video link(s) <span>Youtube or Vimeo</span></label>
                    <input type="text" placeholder="http://" class="new_trend_video multiple_on_input" data-type="new_trend_video" />
                    <label>Website link</label>
                    <input type="text" placeholder="http://" id="new_trend_website" />
                    <label>Spotted where</label>
                    <input type="text" id="new_trend_location" placeholder="trend location" />
                </form>
                <a href="#" class="button no_image two" data-rel="back">Back</a>
                <a href="#new_trend_3" class="button no_image red two" data-transition="slide" data-role="disable" id="new_trend_3_button">Step 3</a>
            </div>
        </div>
    </div>

</div>

<div data-role="page" id="new_trend_3" data-title="New sign | step 3">

    <div data-role="content">
        <div class="container margin">
            <div class="subcontainer big">
                <form class="margin">
                    <label>Tags</label>
                    <input id="new_trend_tagger" />
                    <label>Categories</label>
                    <div class="tags" id="new_trend_categories"></div>
                    <label>Workspace</label>
                    <select class="custom_select" id="new_trend_workspaces">
                        <option value="" disabled="disabled" selected="selected">Workspace</option>
                        <option value="" disabled="disabled">------------</option>
                        <option value="-1">Drafts</option>
                        <option value="" disabled="disabled">------------</option>
                        <option value="0">Open workspace</option>
                    </select>
                    <label>Mentality trend</label>
                    <select class="custom_select" id="new_trend_ment_trends">
                        <option value="" disabled="disabled" selected="selected">Trend</option>
                    </select>
                </form>
                <a href="#" class="button no_image two" data-rel="back">Back</a>
                <a href="#" class="button no_image red two" data-role="disable" id="submit_new_trend">Submit sign</a>
            </div>
        </div>
    </div>

</div>

<div data-role="page" id="research_projects" data-title="My research projects">

    <div data-role="content">
        <div class="container">
            <div class="subcontainer research_projects">
                <a href="#view_project?type=drafts" data-transition="slide" class="button no_image red"><span class="blank"></span>Drafts</a>
                <a href="#view_project?type=open_projects" data-transition="slide" class="button no_image"><span>1.</span>Open projects</a>
            </div>
        </div>
    </div>

</div>



<!--/Create stuff-->

<!--Workspace stuff-->
<div data-role="page" id="view_project" data-title="View project">

    <div data-role="content">
        <div class="container">
            <div class="mini_dropdown_surrounder clearfix">
                <div id="workspace_filter_by" class="mini_dropdown_container static">
                    <section id="filter_by">
                        <label>Filter by:</label>
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
                    </section>
                </div>
                <a href="#" id="workspace_extra_info_button" class="button red">Extra info</a>
            </div>
        </div>
        <div id="trend_container" class="container"></div>
        <div id="trend_container_copy"></div>
    </div>

</div>

<div data-role="page" id="workspace_extra_info" data-title="Extra workspace info">

    <div data-role="content">
        <div class="container margin">
            <div class="subcontainer big"></div>
        </div>
    </div>

</div>

<div data-role="page" id="edit_trend_1" data-title="Edit sign | step 1">

    <div data-role="content">
        <div class="container margin">
            <div class="subcontainer big">
                <form class="margin">
                    <label>Title</label>
                    <input type="text" placeholder="title" id="edit_trend_title" />
                    <label>Description</label>
                    <textarea id="edit_trend_description" placeholder="description"></textarea>
                    <label>Video link(s) <span>Youtube or Vimeo</span></label>
                    <span id="edit_trend_videos">
                        <input type="text" placeholder="http://" class="edit_trend_video multiple_on_input" data-type="edit_trend_video" />
                    </span>
                    <label>Website link</label>
                    <input type="text" placeholder="http://" id="edit_trend_website" />
                    <label>Trend location</label>
                    <input type="text" id="edit_trend_location" placeholder="trend location" />
                </form>
                <a href="#" class="button no_image two" data-rel="back">Back</a>
                <a href="#edit_trend_2" class="button no_image red two" data-transition="slide" data-role="disable" id="edit_trend_2_button">Step 2</a>
            </div>
        </div>
    </div>

</div>

<div data-role="page" id="edit_trend_2" data-title="Edit sign | step 2">

    <div data-role="content">
        <div class="container margin">
            <div class="subcontainer big">
                <form class="margin">
                    <label>Tags</label>
                    <input id="edit_trend_tagger" />
                    <label>Categories</label>
                    <div class="tags" id="edit_trend_categories"></div>
                    <label>Workspace</label>
                    <select class="custom_select" id="edit_trend_workspaces">
                        <option value="" disabled="disabled" selected="selected">Workspace</option>
                        <option value="" disabled="disabled">------------</option>
                        <option value="-1">Drafts</option>
                        <option value="" disabled="disabled">------------</option>
                        <option value="0">Open workspace</option>
                    </select>
                    <label>Mentality trend</label>
                    <select class="custom_select" id="edit_trend_ment_trends">
                        <option value="" disabled="disabled" selected="selected">Trend</option>
                    </select>
                    <input type="hidden" id="edit_trend_id" value="" />
                </form>
                <a href="#" class="button no_image two" data-rel="back">Back</a>
                <a href="#" class="button no_image red two" data-role="disable" id="submit_edit_trend">Edit trend</a>
            </div>
        </div>
    </div>

</div>

<!--/Workspace stuff-->

<!--Explore stuff-->
<div data-role="page" id="explore" data-title="EXPLORE">

    <div data-role="content">
        <form class="search_field" id="explore_search">
            <input type="search" placeholder="Search signs..." />
            <input type="submit" value="" />
        </form>
        <div id="explore_filter_by" class="mini_dropdown_container">
            <section>
                <div class="contain">
                    <label>Filter by:</label>
                    <a href="#" data-d-id="category">Category</a>
                    <a href="#" data-d-id="popularity">Popularity</a>
                    <a href="#" data-d-id="date">Date</a>
                </div>
                <div data-d-id="category"></div>
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
                <div data-d-id="date">
                    <ul>
                        <li><a href="#">Latest first</a></li>
                    </ul>
                    <ul>
                        <li><a href="#">Oldest first</a></li>
                    </ul>
                </div>
            </section>
        </div>
        <div id="image_list"></div>
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
        <div class="container margin">
            <p><b>Signs & Seeds Sign</b><br>
            <i>“Something that suggests the presence or existence of a fact, condition, or quality.”</i>

            <p>Great that you’re using Signs & Seeds!</p>

            <p>This app is designed to help you document, analyze and interpret the signs that exist all around you. This app can also help you plant and harvest seeds. From collecting Signs of Cool to creating Science of Cool.</p>

            <p>There are loads of places on the web where you can find the newest hypes. We distance ourselves from that. Hypes are interesting, but superficial. We are looking for the true meaning behind the things we find.</p>

            <p>Collect your signs of Cool, plant your seeds. Make Science of Cool happen.</p>

            <p>Science of the Time</p>

            <p>Signs & Seeds is powered by the Science of the Time network. Learn what we and our network can do for you and your company. <a href="#">Link?</a></p>

            <p>New to the field of trend research? Here are the ten basics <a href="#explore" data-transition="slide"></a></p>
        </div>
    </div>
</div>
<!--/About page-->

<!--Insufficient privilages-->
<div data-role="page" id="insufficient_privilages" data-title="Insufficient privilages">
    <div data-role="content">
        <div class="container">
            <div class="subcontainer margin">
                <a href="#explore" class="button red no_image">Explore trends</a>
            </div>
        </div>
    </div>
</div>
<!--/Insufficient privilages-->

<!--Panel-->
<div id="settings_panel">
    <div>
        <div><img src="/style/images/default_profile_image.jpg" id="account_profile" alt="profile_pic"></div>
        <a href="#edit_account" data-transition="slide"><span id="account_username">John Doe</span> <span class="small">(edit)</span></a>
    </div>
    <div class="research_projects_settings_button">
        <div><img src="/style/images/icons/folder_icon.png" /></div>
        <a href="#research_projects" id="research_projects_button" data-transition="slide">Research projects</a>
    </div>
    <div class="drafts_settings_button">
        <div><img src="/style/images/icons/folder_icon.png" /></div>
        <a href="#view_project?type=drafts" id="drafts_button" data-transition="slide">Drafts</a>
    </div>
    <div>
        <div><img src="/style/images/settings_panel/logout_icon.png" /></div>
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
<script src="js/jquery_mobile.js"></script>
<script src="js/jquery_cookie.js"></script>
<script src="js/dropzone.js"></script>
<script src="js/custom_select.js"></script>
<script src="js/jquery_tags.js"></script>
<script src="js/jquery_mousewheel.js"></script>
<script src="js/jquery_kinetic.js"></script>
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
<script src="js/all.js"></script>

<!-- Fancybox stuff -->
<script type="text/javascript" src="/fancybox/jquery.fancybox.pack.js?v=2.1.5"></script>
<script type="text/javascript" src="/fancybox/helpers/jquery.fancybox-buttons.js?v=1.0.5"></script>
<script type="text/javascript" src="/fancybox/helpers/jquery.fancybox-media.js?v=1.0.6"></script>
<script type="text/javascript" src="/fancybox/helpers/jquery.fancybox-thumbs.js?v=1.0.7"></script>
<!-- /Fancybox stuff -->

</body>
</html>