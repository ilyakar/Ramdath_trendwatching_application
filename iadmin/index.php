<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="style/main.css">

    <!-- Fancybox stuff -->
    <link rel="stylesheet" href="/fancybox/jquery.fancybox.css?v=2.1.5" type="text/css" media="screen" />
    <link rel="stylesheet" href="/fancybox/helpers/jquery.fancybox-buttons.css?v=1.0.5" type="text/css" media="screen" />
    <link rel="stylesheet" href="/fancybox/helpers/jquery.fancybox-thumbs.css?v=1.0.7" type="text/css" media="screen" />
    <!-- /Fancybox stuff -->
</head>
<body id="admin">

<div id="page_loading">
    <span>No internet connection<br>Please try again...</span>
</div>

<div id="site_message">This is a site message</div>

<header id="main_header">
    <a href="#" class="icon" id="menu_icon"></a>
    <a href="#" data-rel="back" data-direction="reverse" data-transition="slide" class="icon" id="back_icon"></a>
    <a href="#about" data-transition="pop" id="header_logo"></a>
    <div id="header_title"></div>
    <div id="admin_area_title">Admin area</div>
</header>
<!--Login with account-->
<div data-role="page" id="login_with_account" data-title="Login with admin account">

    <div data-role="content">
        <div class="container">
            <div class="subcontainer">
                <form>
                    <div class="message red">Invalid username or password</div>
                    <input type="text" id="login_username" placeholder="username" />
                    <input type="password" id="login_password" placeholder="password" />
                    <a href="#" class="button no_image red" data-role="disable" id="submit_login">Login</a>
                </form>
            </div>
        </div>
    </div>

</div>
<!--/Login with account-->

<!--Admin pages-->
<div data-role="page" id="manage_trends" data-title="Manage trends">

    <div data-role="content">
        <div class="container">
            <div class="mini_dropdown_surrounder clearfix">
                <div id="trend_container_workspace">Viewing workspace: <b>All</b></div>
                <div class="mini_dropdown_container static" id="view_buttons">
                    <section id="view_select">
                        <label>View:</label>
                        <a href="#" class="active">All signs</a>
                        <a href="#">Workspaces</a>
                    </section>
                    <section id="filter_by_select">
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
                    </section>
                </div>
            </div>
            <div id="workspace_container" class="research_projects"></div>
        </div>
        <div id="trend_container" class="research_trends"><!-- dynamically populated --></div>
    </div>

</div>

<div data-role="page" id="view_trend" data-title="View trend">
    <!--Populated dynamically-->
</div>

<!--Edit trend-->
<div data-role="page" id="edit_trend_1" data-title="Edit trend | step 1">

    <div data-role="content">
        <div class="container margin">
            <div class="subcontainer big">
                <form class="margin">
                    <label>Title</label>
                    <input type="text" placeholder="title" id="edit_trend_title" />
                    <label>Description</label>
                    <textarea id="edit_trend_description" placeholder="description"></textarea>
                    <label>Video link <span>Youtube or Vimeo</span></label>
                    <input type="text" placeholder="http://" id="edit_trend_video" />
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

<div data-role="page" id="edit_trend_2" data-title="Edit trend | step 2">

    <div data-role="content">
        <div class="container margin">
            <div class="subcontainer big">
                <form class="margin">
                    <label>Tags</label>
                    <input id="edit_trend_tagger" />
                    <label>Categories</label>
                    <div class="tags" id="edit_trend_categories"></div>
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
<!--/Edit trend-->

<div data-role="page" id="manage_accounts" data-title="Manage accounts">
    <div data-role="content">
        <div class="container">
            <ul id="account_ul"></ul>
        </div>
    </div>
</div>

<!--Manage info-->
<div data-role="page" id="manage_info" data-title="Manage info">
    <div data-role="content">
        <div class="container">
            <div class="subcontainer">
                <form>
                    <label>Workspaces</label>
                    <textarea id="edit_info_workspaces" placeholder="workspaces"></textarea>
                    <label>Categories</label>
                    <textarea id="edit_info_categories" placeholder="categories"></textarea>
                    <label>Mentality trends</label>
                    <textarea id="edit_info_ment_trends" placeholder="mentality trends"></textarea>
                    <a href="#" class="button no_image red two" data-role="disable" id="submit_info_edit">Edit info</a>
                </form>
            </div>
        </div>
    </div>
</div>
<!--/Manage info-->

<!--/Admin pages-->


<!--Edit account-->
<div data-role="page" id="edit_account" data-title="Editing account">

    <div data-role="content">
        <div class="container">
            <div class="subcontainer">
                <form id="edit_profile_form" method="post" enctype="multipart/form-data">

                    <input type="hidden" id="edit_account_id" />

                    <label>Privilage</label>
                    <select class="custom_select" id="edit_account_privilage">
                        <option value="" disabled>Privilage</option>
                    </select>

                    <label>Workspaces</label>
                    <div class="tags small" id="edit_account_workspaces"></div>

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
                    <input type="password" id="edit_password" data-role="pass" data-pass-id="edit_account_pass" placeholder="password" />
                    <input type="password" id="edit_conf_password" data-role="conf-pass" data-pass-id="edit_account_pass" placeholder="confirm password" />

                    <a class="button no_image red" id="submit_account_edit_button" data-role="disable" data-transition="slide" href="#">Submit edit</a>

                </form>
            </div>
        </div>
    </div>
</div>
<!--/Edit account-->

<!--Panel-->
<div id="settings_panel">
    <div>
        <div><img src="/style/images/default_profile_image.jpg" id="account_profile" alt="profile_pic"></div>
        <a><span id="account_username">John Doe</span><span class="small"> | admin</span></a>
    </div>
    <div>
        <div><img src="/style/images/settings_panel/trend_icon.png"></div>
        <a href="#manage_trends">Manage trends</a>
    </div>
    <div>
        <div><img src="/style/images/settings_panel/accounts_icon.png"></div>
        <a href="#manage_accounts">Manage accounts</a>
    </div>
    <div>
        <div><img src="/style/images/settings_panel/info_icon.png"></div>
        <a href="#manage_info">Manage info</a>
    </div>
    <div>
        <div><img src="/style/images/settings_panel/logout_icon.png"></div>
        <a href="#" id="logout_button">Logout</a>
    </div>
</div>
<!--/Panel-->

<script src="/js/jquery_latest.js"></script>
<script src="/js/jquery_mobile.js"></script>
<script src="/js/jquery_cookie.js"></script>
<script src="/js/jquery_lazyload.js"></script>
<script src="/js/jquery_tags.js"></script>
<script src="/js/jquery_dropdown.js"></script>
<script src="/js/tinymce/tinymce.min.js"></script>
<script src="/js/jquery_simpleUpload.js"></script>
<script src="/js/custom_select.js"></script>
<script src="/js/masonry.js"></script>
<script src="/js/md5.js"></script>
<script src="/js/jquery_comments.js"></script>
<script src="/js/jquery_raty.js"></script>
<script src="js/all.js"></script>

<!-- Fancybox stuff -->
<script type="text/javascript" src="/fancybox/jquery.fancybox.pack.js?v=2.1.5"></script>
<script type="text/javascript" src="/fancybox/helpers/jquery.fancybox-buttons.js?v=1.0.5"></script>
<script type="text/javascript" src="/fancybox/helpers/jquery.fancybox-media.js?v=1.0.6"></script>
<script type="text/javascript" src="/fancybox/helpers/jquery.fancybox-thumbs.js?v=1.0.7"></script>
<!-- /Fancybox stuff -->

</body>
</html>