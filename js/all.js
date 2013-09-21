// ----- Primary setup -----
    $(function(){

        // Definitions
        setup_definitions();

        // Check if internet connection dead
        var dead_internet = check_internet_connection();
        if(dead_internet) return;

        // Setup critical plugins
        setup_critical_plugins();

        // Setup facebook and google APIs
        setup_social_APIs();

        // If logged_in
        check_login(); // -> then calls load_ajax();

        // Gets the location (not critical, but needs time to get the location)
        get_location();

        setup_explore();

        preload_images();

    });

// ----- Secondary setup -----
    function load_rest(){

        // Plugin setup
        setup_other_plugins();

        // Init global_page_functions on start AND page change
        on_page_change();

        // Global click functions
        global_click_functions();

        // Form stuff
        form_stuff();

        // Show app
        show_app();

        add_to_homescreen_mobile_show();

        finished_loading = 1;

    }

// ------------------------------ Primary setup ------------------------------

function setup_definitions() {

    logged_in                       = '';

    $header                         = $('#main_header');
    $footer                         = $('#main_footer');

    site_message_timeout            = '';
    type_timeout                    = '';

    finished_loading                = '';
    single_trend_loaded             = '';

    stored_data                     = [];
    stored_data.categories          = [];
    stored_data.trends              = [];
    stored_data.user_info           = [];
    stored_data.research_projects   = [];

}

function check_internet_connection(){

    if(!navigator.onLine){
        $('#page_loading').children('span').show(0);
        return 'dead';
    }

}

function setup_critical_plugins(){

    // Dropzone
    Dropzone.options.imageUploadDropzone = {
        addRemoveLinks: true,
        uploadMultiple: true,
        dictDefaultMessage: 'Drop files here to upload <i>(or click)</i>',
        dictRemoveFile: 'Remove image',
        maxFilesize: 10,
        error: function (par1, error_message){
            site_message(error_message);
        },
        init: function () {

            var total_files = 0,
                complete_files = 0;

            this.on("addedfile", function (file) {
                total_files += 1;
            });
            this.on("removedfile", function (file) {
                total_files -= 1;

                // Update hidden form that updates which files the user has uploaded
                var filename = encodeURIComponent(file.name);
                var $uploaded_field = $('#uploaded_images_field');

                var uploaded_files = $uploaded_field.val();

                // Removes the file from string
                if(uploaded_files.indexOf(filename+',') !== -1) uploaded_files = uploaded_files.replace(filename+',','');
                else    if(uploaded_files.indexOf(','+filename) !== -1) uploaded_files = uploaded_files.replace(','+filename,'');
                else                                                    uploaded_files = uploaded_files.replace(filename,'');

                // Update the string
                $uploaded_field.val(uploaded_files);
                // --

                $.post('../php/remove_image.php', { file: file.name });

            });
            this.on("complete", function (file) {
                complete_files += 1;

                // Update hidden form that contains which files the user has uploaded
                    var filename = encodeURIComponent(file.name);
                    filename = stored_data.user_info.id +'_'+ filename;

                    var $uploaded_field = $('#uploaded_images_field');

                    // Uses PHP to check if image name exists, if so, dynamically create a new one
                    $.post('../php/get_trend_image_upload_name.php', { filename: filename }, function(data){

                        var uploaded_files = $uploaded_field.val();

                        // Update #uploaded_images_field
                        filename = data;

                        if(uploaded_files)  {
                            $uploaded_field.val(uploaded_files+','+filename);
                        }
                        else {
                            $uploaded_field.val(filename);
                        }
                        // --

                    });

                if (complete_files === total_files) {

                    enable_link('#new_trend_2_button'); // Either "#new_trend_2_button" or "#edit_trend_2_button"

                }
            });
            this.on('reset', function(){
                disable_link('#new_trend_2_button'); // Either "#new_trend_2_button" or "#edit_trend_2_button"
                total_files = 0;
                complete_files = 0;
            });

            var _this = this;

            $("#submit_new_trend").click(function(){

                // Resets the form after 1 second... Cause it still has to be accessed first
                setTimeout(function(){
                    _this.removeAllFiles();
                    disable_link('#new_trend_2_button');
                }, 1000);

            })
        }
    };

    tinymce.init({
        selector: "textarea#new_trend_description, textarea#edit_trend_description",
        plugins: "link, paste",

        paste_auto_cleanup_on_paste : true,
        paste_remove_styles: true,
        paste_remove_styles_if_webkit: true,
        paste_strip_class_attributes: true,

        toolbar1: "bold italic underline strikethrough | link unlink | undo redo",

        menubar: false,
        statusbar: false,
        toolbar_items_size: 'small',

        height : 300,

        content_css : "/style/tinymce_adjustments_content.css",

        setup: function(ed){

            ed.on('keyup', function(){
               setup_form_buttons();
            });

        }

    });

}

function setup_social_APIs(){

    // ----- Facebook -----
    FB.init({
        appId      : '1401875310032112', // App ID
        channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
    });

    FB.Event.subscribe('auth.authResponseChange', function(data){

        // Login
        if (data.status === 'connected') {
            check_login('facebook', 'connected');
        }

    });

    // ----- Google -----


}

function load_ajax(new_login){

    $.post('php/get_info.php', function(data){

        // Store the data in a constant
            $.extend(stored_data, data);

            if(new_login !== 'reload'){ // Setup ajax, only if we're not reloading the stored data
                setup_ajax(new_login);
            }

    }, 'JSON');

}

function setup_ajax(new_login){

    setup_categories();
    setup_mentality_trends();
    setup_countries();

    if(logged_in){
        setup_logged_in_stuff(new_login); // Continues onward | load rest is fired when the function finished
    }
    else {
        load_rest();
    }

}

function get_location(){

    if(geoPosition.init()){

        // On success
        geoPosition.getCurrentPosition(function(pos){

            var geocoder = new google.maps.Geocoder();
            var position = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);

            geocoder.geocode({
                'latLng': position
            }, function (results) {

                var city    = results[1]['address_components'][3]['long_name'];
                var country = results[1]['address_components'][4]['long_name'];

                $('#new_trend_location').val(city+', '+country).removeClass('cross').addClass('tick'); // Adds the gotten city to the .trend_location

            });

        });

    }

}

function preload_images() {

    var img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18, img19;

    img1 = img2 = img3 = img4 = img5 = img6 = img7 = img8 = img9 = img10 = img11 = img12 = img13 = img14 = img15 = img16 = img17 = img18 = img19 = new Image();


    img1.src = '/style/images/ajax-loader.gif';

    img2.src = '/style/images/logo.png';

    img3.src = '/style/images/home_screen_image/gradient.png';
    img4.src = '/style/images/home_screen_image/gradient_reverse.png';

    img5.src = '/style/images/home_screen_image/images/1.jpg';

    img6.src = '/style/images/icons.png';
    img7.src = '/style/images/form/cross_deselected.png';
    img8.src = '/style/images/form/cross_selected.png';
    img9.src = '/style/images/form/tick_deselected.png';
    img10.src = '/style/images/form/tick_selected.png';

    img11.src = '/style/images/default_profile_image';
    img12.src = '/style/images/logo_mini.png';
    img13.src = '/style/images/mini_red_cross.png';
    img14.src = '/style/images/icons/star_half.png';
    img15.src = '/style/images/icons/star_grey.png';
    img16.src = '/style/images/icons/star_red.png';
    img17.src = '/style/images/transparent.png';
    img18.src = '/style/images/settings_panel/logout_icon.png';
    img19.src = '/style/images/settings_panel/settings_icon.png';

}

// ------------------------------ Secondary setup ------------------------------

function check_login(type, status) {

    if(logged_in && status !== 'logout') return; // When facebook connects and user is already logged in, it causes some ajax to load twice

    if(type == 'facebook'){ // Type == 'facebook' when facebook is initated and it calls 'check_login()' back

        if(status == 'connected'){
            db_login_check('facebook');
        }

    }
    else if(type == 'google'){
        db_login_check('google');
    }
    else if($.cookie('username_cookie') && $.cookie('password_cookie')){ // todo change

        db_login_check('username');

    }
    else {

        db_login_check('not_logged_in')

    }

    function db_login_check(type){

        var username, password, md5;

        if(type == 'not_logged_in'){
            logged_in = 0;
            load_ajax();
        }
        else if(type == 'username'){

            username    = $.cookie('username_cookie');
            password    = $.cookie('password_cookie');

//            username    = 'ilyakar';
//            password    = '184c87a246338443bc78ba0fb7ca5b11';

            md5         = '';

            start_ajax(username, password, md5, type, '');

        }
        else if(type == 'facebook'){

            FB.api('/me', function(data) {

                var fb_data = data;

                username    = fb_data.username;
                password    = fb_data.id;

                md5         = 1;

                start_ajax(username, password, md5, type, fb_data);

            });
        }
        else if(type == 'google'){

            var ggl_data = stored_data.google_user;

            username = stored_data.google_user.email;
            password = stored_data.google_user.id;

            md5      = 1;

            start_ajax(username, password, md5, type, ggl_data);

        }


        function start_ajax(username, password, md5, type, extra_info) {

            $.post('../php/check_login.php', {

                username    : username,
                password    : password,
                md5         : md5,
                type        : type,
                extra_info  : extra_info

            }, function(data){

                // Logged in
                if(data.user_info){
                    $.extend(stored_data, data); // Updates the stored_data to hold the user information

                    if(type == 'facebook' || type == 'google'){ // Sets the cookies here cause it needs to get the pass from DB
                        $.cookie('username_cookie', stored_data.user_info.username);
                        $.cookie('password_cookie', stored_data.user_info.password);
                    }

                    logged_in = 1;

                    if(type == 'facebook'){
                        load_ajax(1); // 1 is for (new_login), so that "load_rest()" isn't fired once more
                        FB.logout(); // Got the data, got the cookies. Now logout from facebook. No more need for it
                        show_create_page(1);
                    }
                    else if(type == 'google'){
                        load_ajax(1); // 1 is for (new_login), so that "load_rest()" isn't fired once more
                        show_create_page(1);
                    }
                    else {
                        load_ajax();
                    }

                }

                // Invalid username or password in cookie
                else {
                    $.removeCookie('username_cookie');
                    $.removeCookie('password_cookie');

                    check_login(); // Will now either do a google or facebook login check

                }

            }, 'JSON');
        }

    }

}

function on_page_change() {
    global_page_functions(1);

    // Runs on page change
    $(document).delegate('.ui-page', 'pagebeforeshow', function () {
        console.log('page before show');
        global_page_functions();
    });

}

function global_click_functions() {

    if(finished_loading) return;

    $('body').on('click', '#workspace_extra_info_button', function(){

        show_workspace_info_page(this);

    });

    $('body').on('change', '#new_trend_workspaces, #edit_trend_workspaces', function(){

        change_trend_workspace(this);

    });

    $('body').on('click', '#explore_search [type="submit"]', function(){

        search_explore();

    });

    $footer.find('#create_button').click(function(){

        if($footer.hasClass('home')){ // Only work if on HOME page

            $footer.hasClass('reveal') ? $footer.removeClass('reveal') : $footer.addClass('reveal');
            $('#home_image').hasClass('move') ? $('#home_image').removeClass('move') : $('#home_image').addClass('move');

            return false; // Don't let the link take the user the the actual page

        }

        // This can only happen if the button is clicked whilst on the EXPLORE page.
        // Will take the user to the home page and open the slider panel
        else if(!logged_in){

            $.mobile.changePage('#home_page', 'pop');

            $('#explore_button').removeClass('selected');

            $footer.find('#create_button').click();

            return false;

        }

    });

    $('body').on('change', '#mobile_trend_images_upload [type="file"]', function(){

        trend_thumbnail_upload(this);

    });

    $('body').on('click', '#mobile_trend_images_upload a', function(){

        delete_trend_thumbnail(this);

    });

    $('body').on('click', '#login_with_google', function(){
       login_with_google_click();
    });

    $('body').on('keyup', '#reg_username', function(){

        check_register_info(this, 'username');

    });

    $('body').on('keyup', 'fieldset.date_of_birth input', function(){

        check_date_of_birth(this);

    });

    $('body').on('keyup', '#reg_email, #edit_email', function(){

        check_register_email(this);

    });

    $('body').on('click', '#explore_filter_by li a', function(){

        click_explore_filter_by_button(this);

    });

    $('body').on('click', '#workspace_filter_by li a', function(){

        click_workspace_filter_by_button(this);

    });


    $('body').on('click', 'a.trend_link', function(data){

        var hash = data.currentTarget.hash;
        var id = $.textParam('id', hash);
        setup_single_trend(id);

    });

    $('body').on('click', '#research_projects .research_projects a, #drafts_button', function(data){
        setup_research_project_click(data);
    });

    // On menu icon click
    $('body').on('click', '#menu_icon', function(){

        // Open panel
        if(!$('body').hasClass('open_panel')){
            $('body').addClass('open_panel');
        }
        else {
            $('body').removeClass('open_panel');
        }

    });

    // Login with facebook
    $('body').on('click', '#login_with_facebook', function(){
        FB.login();
    });

    // Logout
    $('body').on('click', '#logout_button', function(){
       account_logout();
    });

    // On new trend submit
    $('body').on('click', '#submit_new_trend', function(){

        if($(this).attr('data-role') == 'disable') return;

        submit_trend();

    });

    // CREATE | EXPLORE
    $('#create_button').click(function(){

        if(location.hash == '#create') return;

    });

    $('#explore_button').click(function(){

        if(location.hash == '#explore') return;

    });

    // Login
    $('#submit_login').click(function(){

        if($(this).attr('data-role') == 'disable') return; // Only continue if the link is active

        submit_login();

    });

    $('#submit_registration_button').click(function(){

        if($(this).attr('data-role') == 'disable') return; // Only continue if the link is active

        submit_register();

    });

    $('#submit_account_edit_button').click(function(){

        if($(this).attr('data-role') == 'disable') return; // Only continue if the link is active

        submit_account_edit();

    });

    // Workspace stuff
        $('body').on('click', '#view_project a:contains(Edit)', function(){

            edit_trend(this);

        });
        $('body').on('click', '#view_project a:contains(Delete)', function(){

            delete_trend(this);

        });

    $('#submit_edit_trend').click(function(){

        if($(this).attr('data-role') == 'disable') return;

        submit_edit_trend();

    });

}

function setup_other_plugins(type){

    // Tag plugin
        $('#new_trend_tagger, #edit_trend_tagger').tagsInput({
            height: '100%',
            width: '100%',
            onChange: function(){

                var $input = $('#new_trend_tagger_tagsinput');

                if($input.children('span').length)  $input.removeClass('cross').addClass('tick');
                else                                $input.removeClass('tick').addClass('cross');

                setup_form_buttons();

            }
        });

    // Explore filter_by dropdown plugin
        $('#explore_filter_by').dropdown();

    // Workspace filter by
        $('#workspace_filter_by').dropdown();

    // Fancybox
        $('.fancybox').fancybox();

    if(type == 'masonry_workspace'){

        var $container = $('#trend_container');
        var cnt = 0;
        var loaded = '';

        $container.find('img').error(function(data){

            cnt++;
            check_loaded();

        })
            .load(function(){

                cnt++;

                check_loaded();

            });

        function check_loaded(){
            if(cnt == $container.find('img').length){

                $container.masonry({
                    columnWidth: 75.5
                });

                loaded = 1;

            }
        }
    }

}

function form_stuff(refresh) {

    var $body = $('body');

    // Adds the .cross class to all input fields
    var $inputs = $('input[type="text"], input[type="password"], textarea, .tagsinput');
    for(var i=0; i<$inputs.length; i++){

        var $input = $inputs.eq(i);
        $input.val() || $input.children('span.tag').length ? $input.removeClass('cross').addClass('tick') : $input.removeClass('tick').addClass('cross');

    }

    if(refresh) return;

    // Changes form class to either .tick or .cross
    $body.on('keyup', 'input[type="text"], input[type="password"], textarea', function(){

        if($(this).attr('data-form') == 'no-tick') return;

        var num = $(this).val().length;
        if(num > 0){
            $(this).removeClass('cross').addClass('tick');
        }
        else {
            $(this).removeClass('tick').addClass('cross');
        }

        setup_form_buttons(); // If everything is filled in (happens on keyup) then undisable the button

    });

    // Password stuff
    $body.on('keyup', 'input[data-role="pass"]', function(){

        var id = $(this).attr('data-pass-id');

        var $conf_input = $('input[data-role="conf-pass"][data-pass-id="'+ id +'"]');

        var val_pass = $(this).val();
        var val_conf = $conf_input.val();

        if(val_conf == val_pass && val_conf !== ''){
            $conf_input.removeClass('cross').addClass('tick');
        }
        else {
            $conf_input.removeClass('tick').addClass('cross');
        }

        setup_form_buttons();

    });
    $body.on('keyup', 'input[data-role="conf-pass"]', function(){

        var id = $(this).attr('data-pass-id');

        var val_pass = $('input[data-role="pass"][data-pass-id="'+ id +'"]').val();
        var val_conf = $(this).val();

        if(val_conf == val_pass && val_conf !== ''){
            $(this).removeClass('cross').addClass('tick');
        }
        else {
            $(this).removeClass('tick').addClass('cross');
        }

        setup_form_buttons();

    });

    // Select stuff
    $body.on('change', 'select', function(){

        $(this).parents('.select').removeClass('cross').addClass('tick');

        setup_form_buttons();

    });

    // Tag stuff
    $body.on('focus', '.tagsinput input', function(){

        $(this).parents('.tagsinput').addClass('focus');

    });
    $body.on('focusout', '.tagsinput input', function(){

        $(this).parents('.tagsinput').removeClass('focus');

    });

    $body.on('change', '.thumbnail_upload [type="file"]', function(){

        var $el = $(this).parent();

        if (this.files && this.files[0]) {

            var reader = new FileReader();

            reader.onload = function (e) {
                var $img    = $el.find('img');
                    $img    .attr('src', e.target.result);

                var width   = $img.width();
                var height  = $img.height();

                if(height > width){
                    $img.css({
                        width: '100%',
                        height: 'auto'
                    });
                }
            }

            reader.readAsDataURL(this.files[0]);

            setup_form_buttons();
        }

    });

    // On tag click
    $body.on('click', '.tags div', function(){

        $(this).hasClass('selected') ? $(this).removeClass('selected') : $(this).addClass('selected');

        setup_form_buttons();

    });

    $('body').on('click', 'form.search_field [type="submit"]', function(){

        return false;

    });

    // Form submit on ENTER
    $body.on('keyup', 'input[type="text"], input[type="password"], textarea', function(){

        if(!event) return;

        var key = event.keyCode || event.which;

        if (key === 13) {

            $(this).parents('form').find('a').click();

        }

    });

    // Multiple input fields on insert
    $body.on('keyup', 'input.multiple_on_input', function(){

        var key = event.keyCode || event.which;

        var $this = $(this);
        var type = $this.attr('data-type'); // Defines which group of elements this will be

        var $group = $('input.multiple_on_input[data-type="'+ type +'"]');

        // On character type
            if($this.val().length > 0){
                if($this.index() == $group.last().index()){ // If last element of group

                    $group.last().after( // Previous element
                        $this.clone().val('').removeClass('tick').addClass('cross').css('display', 'none') // New element
                    ).next().fadeIn(200);
                }
            }


        // On backspace
            else if($this.index() !== $group.last().index()) {

                if(key === 9) return; // Don't remove anything on tab

                if($this.index() == $group.last().index() -1){ // On pre-last element in group

                    // Hide and remove
                    $this.next().fadeOut(200);
                    setTimeout(function(){
                        $this.next().remove();
                    }, 200);

                }
                else { // On any element except last or pre-last in group

                    $this.fadeOut(200);
                    setTimeout(function(){
                        $this.remove();
                    }, 200);

                }
            }

    });

    $body.on('click', 'fieldset.checkbox [type="checkbox"]', function(){
        setup_form_buttons();
    });

    $body.on('click', 'fieldset.checkbox span', function(){
        $(this).parents('fieldset').find('[type="checkbox"]').click();
        setup_form_buttons();
    });

}

function show_app(){

    // Opened any page other than "trend"
    if(!(location.hash && $('#home_page').hasClass('ui-page-active'))){
        loader('hide');
    }

    // Opened trend which is not loaded at first second
    else {
        jQuery.mobile.changePage( $(location.hash) );
        setTimeout(function(){
            loader('hide');
        }, 200);
    }

}

function add_to_homescreen_mobile_show() {

    if(location.hash) return; // Only show on home page

    if($(window).width() > 769){
        var window_type = 'desktop';
    }
    else {
        var window_type = 'mobile';
    }

    if(window_type == 'mobile'){

        if($.cookie('add_to_homescreen')) return;

        setTimeout(function(){

            $('#add_to_homescreen').fadeIn(700);
            setTimeout(function(){
                $('#add_to_homescreen').fadeOut(700);
            }, 5000);

            $.cookie('add_to_homescreen', 'shown');

        }, 1000);
    }

}

// ---------------- Other functions (called by other functions) -----------------

function show_workspace_info_page(that){

    var workspace_id = $(that).attr('data-id');

    // Gets current workspace
    var workspace = $.grep(stored_data.research_projects, function(e){
        return e.id == workspace_id
    });
    workspace = workspace[0];


    $('#workspace_extra_info')
        .attr('data-title', workspace.name +' extra info')
        .find('.subcontainer').html(workspace.more_info_html);
    $.mobile.changePage('#workspace_extra_info', 'pop');

}

function change_trend_workspace(that){

    var $container = $('#new_trend_ment_trends, #edit_trend_ment_trends');

    // Resets mentality trends
        $container.html('<option value="" disabled="disabled" selected="selected">Trend</option>');
        setup_mentality_trends();

    var workspace_id = $(that).val();

    var ment_trends = $.grep(stored_data.mentality_trends, function(e){
        return e.workspace_id == workspace_id
    });

    if(ment_trends.length){
        $container.append('<option value="">------------</option>');
        for(var i=0; i<ment_trends.length; i++){
            var ment_trend = ment_trends[i];
            $container.append('<option value="'+ ment_trend.id +'">'+ ment_trend.name +'</option>');
        }
    }

}

function delete_trend_thumbnail(that){

    console.log($(that).parent());

    // Update hidden form that updates which files the user has uploaded
        var filename = $(that).parent().find('img').attr('alt');
        var $uploaded_field = $('#uploaded_images_field');

        var uploaded_files = $uploaded_field.val();

        // Removes the file from string
        if(uploaded_files.indexOf(filename+',') !== -1) uploaded_files = uploaded_files.replace(filename+',','');
        else    if(uploaded_files.indexOf(','+filename) !== -1) uploaded_files = uploaded_files.replace(','+filename,'');
        else                                                    uploaded_files = uploaded_files.replace(filename,'');

        // Update the string
        $uploaded_field.val(uploaded_files);
        // --

    $(that).parent().fadeOut(200);
    setTimeout(function(){
        $(that).parent().remove();
    }, 200);

    setup_form_buttons();

}

function trend_thumbnail_upload(that){

    // If more than 10 MB
    var file_size = that.files[0].size / 1024 / 1024;
    var max_file_size = 10;
    file_size = Math.ceil(file_size * 100)/100;
    if(file_size > max_file_size){
        site_message('File is too big ('+ file_size +'MB). Max filesize: '+ max_file_size +'MB.');
        return;
    }

    var $container = $(that).parent();

    $container.addClass('uploading');

    $container.ajaxSubmit({
        url: '../php/upload_images.php',
        success: function(data){
            if (that.files && that.files[0]) {

                var file = that.files[0];

                // Update hidden form that contains which files the user has uploaded
                    var filename = encodeURIComponent(file.name);
                        filename = stored_data.user_info.id +'_'+ filename;

                    var $uploaded_field = $('#uploaded_images_field');

                    // Uses PHP to check if image name exists, if so, dynamically create a new one
                    $.post('../php/get_trend_image_upload_name.php', { filename: filename }, function(data){

                        var uploaded_files = $uploaded_field.val();

                        // Update #uploaded_images_field
                            filename = data;

                            if(uploaded_files)  {
                                $uploaded_field.val(uploaded_files+','+filename);
                            }
                            else {
                                $uploaded_field.val(filename);
                            }

                // Show image
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        $(that).parent()
                            .addClass('image_chosen')
                            .find('img').attr('src', e.target.result).attr('alt', filename);
                        optimise_image();
                        make_new_add();
                    }

                    reader.readAsDataURL(file);

                // Enable next button
                    enable_link('#new_trend_2_button');

                    });

            }
        },
        error: function(data){
            site_message(JSON.stringify(data));
        }
    });

    function make_new_add(){
        $container.after(
            '<form method="post" enctype="multipart/form-data">' +
                '<span>Add image</span>' +
                '<img src="" />' +
                '<input type="file" name="file" />' +
                '<a href="#">Remove image</a>' +
            '</form>'
        );
    }
    function optimise_image(){
        _do();
        setTimeout(function(){
            _do();
        }, 300);

        function _do(){
            var $img = $(that).parent().find('img');
            if($img.height() < $img.width()){
                $img.css({
                    height: '100%',
                    width: 'auto'
                });
            }
        }
    }
}

function login_with_google_click(){
    var OAUTHURL    =   'https://accounts.google.com/o/oauth2/auth?';
    var VALIDURL    =   'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
    var SCOPE       =   'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    var CLIENTID    =   '818778407123.apps.googleusercontent.com';
//    var REDIRECT    =   'http://localhost:8888/blank_page.html';
    var REDIRECT    =   'http://sott.eu01.aws.af.cm/blank_page.html';
    var TYPE        =   'token';
    var _url        =   OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
    var acToken;
    var tokenType;
    var expiresIn;
    var user;
    var loggedIn    =   false;

    // Start the stuff
    var win         =   window.open(_url, "windowname1", 'width=800, height=600');
    var pollTimer   =   window.setInterval(function() {
        try {
            console.log(win.document.URL);
            if (win.document.URL.indexOf(REDIRECT) != -1) {
                window.clearInterval(pollTimer);
                var url =   win.document.URL;
                acToken =   gup(url, 'access_token');
                tokenType = gup(url, 'token_type');
                expiresIn = gup(url, 'expires_in');
                win.close();

                validateToken(acToken);
            }
        } catch(e) {
        }
    }, 500);

    function validateToken(token) {
        $.ajax({
            url: VALIDURL + token,
            data: null,
            success: function(responseText){
                getUserInfo();
            },
            dataType: "jsonp"
        });
    }

    function getUserInfo() {
        $.ajax({
            url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
            data: null,
            success: function(user_info) {
                var data = [];
                data.google_user = user_info;
                $.extend(stored_data, data);
                console.log(stored_data);
                check_login('google');
            },
            dataType: "jsonp"
        });
    }

    //credits: http://www.netlobo.com/url_query_string_javascript.html
    function gup(url, name) {
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regexS = "[\\#&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec( url );
        if( results == null )
            return "";
        else
            return results[1];
    }
}

function setup_countries(){

    var countries = stored_data.countries;

    for(var i=0; i<countries.length; i++){

        var country = countries[i];
        $('#reg_country, #edit_country').append('<option value="'+ country.country +'">'+ country.country +'</option>');

    }

}

function check_date_of_birth(that){

    var $el = $(that);

    var id = $el.attr('id');

    if(!$el.val() || typeof(parseInt($el.val())) !== 'number') return;

    // DD
    if(id == 'reg_date_of_birth_1' || id == 'edit_date_of_birth_1'){

        if($el.val() > 0 && $el.val() < 32 && $el.val().length == 2){
            $el.removeClass('cross').addClass('tick')
        }
        else {
            $el.removeClass('tick').addClass('cross')
        }

    }

    // MM
    else if(id == 'reg_date_of_birth_2' || id == 'edit_date_of_birth_2'){

        if($el.val() > 0 && $el.val() < 13 && $el.val().length == 2){
            $el.removeClass('cross').addClass('tick')
        }
        else {
            $el.removeClass('tick').addClass('cross')
        }

    }

    // YYY
    else if(id == 'reg_date_of_birth_3' || id == 'edit_date_of_birth_3'){

        if($el.val() > 1900 && $el.val() < 2015 && $el.val().length == 4){
            $el.removeClass('cross').addClass('tick')
        }
        else {
            $el.removeClass('tick').addClass('cross')
        }

    }

    setup_form_buttons();

}

function check_register_email(that){

    var $el = $(that);
    var val = $el.val();

    $el.removeClass('tick').addClass('cross');

    if(validateEmail(val)){
        check_register_info(that, 'email');
    }

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

}

function check_register_info(that, type){

    $(that).removeClass('cross').addClass('loading');

    clearTimeout(type_timeout);

    type_timeout = setTimeout(function(){

        var val     = $(that).val();

        $.post('../php/check_register_info.php', {
            type: type,
            val: val
        }, function(found){

            if(found > 0){
                $(that).removeClass('loading').removeClass('tick').addClass('cross');
                site_message('The given '+ type +' is taken.');
                setup_form_buttons();
            }
            else {
                $(that).removeClass('loading').removeClass('cross').addClass('tick');
                site_message('hide');
                setup_form_buttons();
            }

        });

    }, 600);

}

function setup_mentality_trends(){

    var $container = $('#new_trend_ment_trends, #edit_trend_ment_trends');
    var ment_trends = stored_data.mentality_trends;

    // -- Mentality trends --
    for(var i=0; i<ment_trends.length; i++){
        var ment_trend = ment_trends[i];
        if(!ment_trend.workspace_id){
            $container.append('<option value="'+ ment_trend.id +'">'+ ment_trend.name +'</option>');
        }
    }

}

function setup_categories(){

    var categories = stored_data.categories;

    // -- Categories --
    var $container  = $('#new_trend_categories, #edit_trend_categories');
    var $container2 = $('#explore_filter_by').find('div[data-d-id="category"]');
    var $container3 = $('#workspace_filter_by').find('div[data-d-id="category"]');

    for(var i=0; i<categories.length; i++){

        // Trend
        var category = categories[i];
        $container.append(
            '<div>' +
                category.name +
                '</div>'
        );

        // #explore_filter_by
        $container2.append(
            '<li><a href="#">' +
                category.name +
                '</a></li>'
        );

        // #workspace_filter_by
        $container3.append(
            '<li><a href="#">' +
                category.name +
                '</a></li>'
        );

    }

    // Wraps each 3 categories with a div
    var categories = $container2.children('li');
    var num = categories.length;
    var ceil = Math.ceil(num/3);

    for(var i=0; i<num; i+=ceil){

        categories.slice(i, i+ceil).wrapAll('<ul></ul>');

    }


    // Wraps each 3 categories with a div
    var categories = $container3.children('li');
    var num = categories.length;
    var ceil = Math.ceil(num/3);

    for(var i=0; i<num; i+=ceil){

        categories.slice(i, i+ceil).wrapAll('<ul></ul>');

    }

}

function search_explore(){

    var search_keyword = $('#explore_search').find('input[type="search"]').val();

    if($(window).width() > 769){
        var window_type = 'desktop';
    }
    else {
        var window_type = 'mobile';
    }

    var $container              = window_type == 'desktop' ? $('#image_list .scrollableArea') : $('#image_list');
    var $container_untouched    = $('#image_list_copy');

    // Adds HTML to the untouched container on first click
    if(!$container_untouched.html()){
        $container_untouched.html($container.html());
    }

    // refresh container HTML with full data
    $container.html($container_untouched.html());

    var trends = $.grep(stored_data.trends, function(e){
        return  e.title                          .toLowerCase().indexOf(search_keyword) > -1 ||
                e.description                    .toLowerCase().indexOf(search_keyword) > -1 ||
                e.website                        .toLowerCase().indexOf(search_keyword) > -1 ||
                e.location                       .toLowerCase().indexOf(search_keyword) > -1 ||
                e.tags                           .toLowerCase().indexOf(search_keyword) > -1 ||
                e.categories                     .toLowerCase().indexOf(search_keyword) > -1 ||
                e.ment_trend                     .toLowerCase().indexOf(search_keyword) > -1
    });

    // Creates attributes variable
    var attributes = '';
    for(var i=0; i<trends.length; i++){

        var trend = trends[i];

        attributes += ':not([data-id='+ trend.id +'])';

    }

    if(attributes){
        $container.find('div[data-categories]'+ attributes +'').remove();
    }

    if(window_type == 'desktop'){
        $('#image_list').smoothDivScroll("recalculateScrollableArea");
    }

    $("img.lazyload").lazyload({
        effect      : 'fadeIn',
        container   : $('.scrollWrapper')
    });

}

function show_create_page(change_page, refresh){

    if(change_page || refresh){

        if(!refresh){
            $.mobile.changePage('#create', 'pop');
        }
        else {
            window.location = '/#create';
        }

    }

}

function site_message(text, permanent){

    var $container = $('#site_message');

    if(text == 'hide'){
        $container.removeClass('show');
        return;
    }

    $container.text(text).addClass('show')

    if(!permanent){

        clearTimeout(site_message_timeout);
        site_message_timeout =
            setTimeout(function(){

                $container.removeClass('show')

            }, 5000);
    }

}

function if_not_home_page(){

    if(location.hash && location.hash !== '#about' && location.hash !== '#insufficient_privilages' && location.hash !== '#create' && location.hash !== '#research_projects' && location.hash !== '#explore' && location.hash !== '#edit_account'){

        return true;

    }
    else {

        return false;

    }

}

function click_explore_filter_by_button(that){

    if($(window).width() > 769){
        var window_type = 'desktop';
    }
    else {
        var window_type = 'mobile';
    }

    var container           = window_type == 'desktop' ? '#image_list .scrollableArea' : '#image_list';
    var container_copy      = '#image_list_copy';

    var type                    = $(that).parents('div').attr('data-d-id');
    var $container              = $(container);
    var $container_untouched    = $(container_copy);

    // Adds HTML to the untouched container on first click
    if(!$container_untouched.html()){
        $container_untouched.html($container.html());
    }

    // refresh container HTML with full data
    $container.html($container_untouched.html());

    // Resets the active class
    $('a[data-d-id]:not([data-d-id="'+ type +'"])').removeClass('active');
    $('div[data-d-id]:not([data-d-id="'+ type +'"])').find('a.active').removeClass('active'); // Removes ".active" from elements outside current type

    var $actives = $(that).parents('div[data-d-id]').find('a.active');
    if(type !== 'category' && $actives.length){
        $actives.not(that).removeClass('active');
    }

    if(!$(that).hasClass('active')){ // Adds the .active class if it didn't yet exist
        $(that).addClass('active');
    }
    else { // Removes the .active class if it exists
        $(that).removeClass('active');
    }

    if($(that).parents('div[data-d-id]').find('a.active').length){ // Adds .active class to the main button
        $('#explore_filter_by').find('a[data-d-id="'+ type +'"]').addClass('active');
    }
    else { // Removes .active class from the main button
        $('#explore_filter_by').find('a[data-d-id="'+ type +'"]').removeClass('active');
    }

    // Specific filter functions
    if(type == 'category'){

        var attributes = '';
        var els = $(that).parents('div[data-d-id]').find('a.active');
        for(var i=0; i<els.length; i++){
            var el = els.eq(i);
            attributes += '[data-categories*='+ el.text() +']';
        }

        if(attributes){
            $container.find('div[data-categories]:not('+ attributes +')').remove();
        }

    }
    else if(type == 'popularity'){

        var value = $(that).text().toLocaleLowerCase();

        if(value == 'views'){
            var attr= 'data-views';
        }
        else if(value == 'rating'){
            var attr = 'data-rating';
        }
        else if(value == 'discussions'){
            var attr = 'data-num-comments';
        }

        if($(that).hasClass('active')){
            var $els = $container.find('['+ attr +']');
            $els.sort(function(a, b) {
                return parseInt($(b).attr(attr)) - parseInt($(a).attr(attr));
            });
            $container.html($els);
        }

    }
    else if(type == 'date'){

        var value = $(that).text().toLocaleLowerCase();

        var attr = 'data-id';

        if(value == 'oldest first'){
            if($(that).hasClass('active')){
                var els = $container.find('['+ attr +']');
                els.sort(function(a, b) {
                    return parseInt($(a).attr(attr)) - parseInt($(b).attr(attr));
                });

                $container.find('[data-num-comments]').remove();
                $container.html(els);
            }
        }

    }

    // Desktop
    if(window_type == 'dekstop'){
        $('#image_list').smoothDivScroll("recalculateScrollableArea");
    }

    // Mobile - Hide filters on click
    else {
        $('a[data-d-id="'+ type +'"]').removeClass('selected')
        $('div[data-d-id="'+ type +'"]').removeClass('selected');
    }

    $("img.lazyload").lazyload({
        effect      : 'fadeIn',
        container   : $('.scrollWrapper')
    });
}

function click_workspace_filter_by_button(that){

    if($(window).width() > 769){
        var window_type = 'desktop';
    }
    else {
        var window_type = 'mobile';
    }

    var type                    = $(that).parents('div').attr('data-d-id');
    var $container              = $('#trend_container');

    if(type == 'category'){
        $container.find('[data-id]').show(0);
        $container.masonry('layout');
    }
    else {
        $container.masonry('destroy');
    }

    // Resets the active class
    $('a[data-d-id]:not([data-d-id="'+ type +'"])').removeClass('active');
    $('div[data-d-id]:not([data-d-id="'+ type +'"])').find('a.active').removeClass('active'); // Removes ".active" from elements outside current type

    var $actives = $(that).parents('div[data-d-id]').find('a.active');
    if(type !== 'category' && $actives.length){
        $actives.not(that).removeClass('active');
    }

    if(!$(that).hasClass('active')){ // Adds the .active class if it didn't yet exist
        $(that).addClass('active');
    }
    else { // Removes the .active class if it exists
        $(that).removeClass('active');
    }

    if($(that).parents('div[data-d-id]').find('a.active').length){ // Adds .active class to the main button
        $('#filter_by').find('a[data-d-id="'+ type +'"]').addClass('active');
    }
    else { // Removes .active class from the main button
        $('#filter_by').find('a[data-d-id="'+ type +'"]').removeClass('active');
    }

    // Specific filter functions
    if(type == 'category'){

        var attributes = '';
        var els = $(that).parents('div[data-d-id]').find('a.active');
        for(var i=0; i<els.length; i++){
            var el = els.eq(i);
            attributes += '[data-categories*='+ el.text() +']';
        }
        if(attributes){
            var $els = $container.find('div[data-categories]:not('+ attributes +')');
        }

        if($els){
            $els.hide(0);
        }
        $container.masonry('layout');

    }
    else if(type == 'popularity'){

        var value = $(that).text().toLocaleLowerCase();

        if($(that).hasClass('active')){
            if(value == 'views'){
                var attr= 'data-views';
            }
            else if(value == 'rating'){
                var attr = 'data-rating';
            }
            else if(value == 'discussions'){
                var attr = 'data-num-comments';
            }
        }

        // This is if a popularity has been deselected
        else {
            var attr = 'data-id';
        }

        var $els = $container.find('['+ attr +']');

        $els.sort(function(a, b) {
            return parseInt($(b).attr(attr)) - parseInt($(a).attr(attr));
        });

        $container.html($els);

    }
    else if(type == 'date'){

        var value = $(that).text().toLocaleLowerCase();

        var attr = 'data-id';

        var $els = $container.find('['+ attr +']');

        if(value == 'oldest first'){

            $els.sort(function(a, b) {
                return parseInt($(a).attr(attr)) - parseInt($(b).attr(attr));
            });


        }

        if(value !== 'oldest first' || !$(that).hasClass('active')) {

            $els.sort(function(a, b) {
                return parseInt($(b).attr(attr)) - parseInt($(a).attr(attr));
            });

        }

        $container.html($els);

    }

    if(type !== 'category'){
        $container.masonry({
            columnWidth: 75.5
        });
    }

    // Mobile - Hide filters on click
    if(window_type == 'mobile') {
        $('a[data-d-id="'+ type +'"]').removeClass('selected')
        $('div[data-d-id="'+ type +'"]').removeClass('selected');
    }

}

function submit_edit_trend(){
    var trend_id        = $('#edit_trend_id')                       .val();

    var title           = $('#edit_trend_title')                    .val();
    var description     = tinyMCE.activeEditor                      .getContent();

    var videos          = get_multiple_inputs('.edit_trend_video');

    var website         = $('#edit_trend_website')                  .val();
    var location        = $('#edit_trend_location')                 .val();

    var tags            = get_tags('#edit_trend_tagger_tagsinput');
    var categories      = get_categories('#edit_trend_categories');
    var workspace       = $('#edit_trend_workspaces')               .val();
    var ment_trend      = $('#edit_trend_ment_trends')              .val();

    // Submit info
    $.post('../php/update_trend.php', {
        trend_id        : trend_id,

        title           : title,
        description     : description,
        videos          : videos,
        website         : website,
        location        : location,

        tags            : tags,
        categories      : categories,
        workspace       : workspace,
        ment_trend      : ment_trend
    },function(data){
        console.log(data);
        load_ajax('reload');
        $.mobile.changePage('#research_projects', 'pop');
        go_home(1);
        site_message('You have edited the trend "'+ title +'"');

    });
}

function setup_research_project_click(data){

    if(data.currentTarget.hash.indexOf('type') > -1){
        var type = $.textParam('type', data.currentTarget.hash);
    }
    else {
        var type    = '';
    }

    var $container = $('#trend_container');

    if($container.attr('style')){
        $container.masonry('destroy');
    }

    // Drafts
    if(type == 'drafts'){
        var project_trends = $.grep(stored_data.trends, function(e){
            return e.research_project   == -1 && // ID of drafts
                   e.user_id            == stored_data.user_info.id; // Only shows the projects by the user
        });
    }

    // Open projects
    else if(type == 'open_projects'){
        var project_trends = $.grep(stored_data.trends, function(e){
            return e.research_project   == 0 // ID of any open project
        });
    }

    // Workspaces
    else {
        var id      = $.textParam('id', data.currentTarget.hash);
        var project_trends = $.grep(stored_data.trends, function(e){
            return e.research_project == id; // ID of the chosen research project
        });
    }

    console.log(project_trends);

    // Gets current workspace
        var workspace = $.grep(stored_data.research_projects, function(e){
            return e.id == id
        });
        workspace = workspace[0];

    // Setup "extra info button"
        if(workspace && $(workspace.more_info_html).text()){
            $('#workspace_extra_info_button').show(0).attr('data-id', id);
        }
        else {
            $('#workspace_extra_info_button').hide(0);
        }

    var trend_html = '';

    // Loop per trend in research project
        for(var i=0; i<project_trends.length; i++) {

            var project_trend = project_trends[i];

            if(project_trend.rating){
                var rating = (project_trend.rating.score_cool + project_trend.rating.score_potential) / 2 / project_trend.rating.votes;
            }
            else {
                var rating = 0;
            }

            if(project_trend.user_id == stored_data.user_info.id || stored_data.user_info.privilage == 'd' || stored_data.user_info.privilage == 'e' || stored_data.user_info.privilage == 'f'){
                var can_edit_content = 1;
            }
            else {
                var can_edit_content = 0;
            }


            project_trend.link_title = 'view_trend?id='+ project_trend.id +'&title='+ project_trend.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')

            trend_html +=
                '<div data-id="'+ project_trend.id +'" data-categories="'+ project_trend.categories +'" data-num-comments="'+ project_trend.num_comments +'" data-rating="'+ rating +'" data-views="'+ (project_trend.views ? project_trend.views : 0) +'">' +
                    '<a href="#'+ project_trend.link_title +'" class="trend_link">' +
                        '<div class="image_container">' +
                        '   <img src="/images/'+ project_trend.images.split(',')[0] +'" alt="research project image">' +
                        '</div>' +
                        '<span>'+ (project_trend.premium > 0  ? '<p></p>' : '') + truncate(project_trend.title, 25) + (can_edit_content ? '<i></i>' : '' ) +'</span>' +
                    '</a>' +
                    ( can_edit_content ? add_extra_html() : '' ) +
                '</div>';

        }
        if(!project_trends.length){

            trend_html += '<div class="message show red">No signs in this research project.</div>';

        }

    // Adds the delete & remove button
        function add_extra_html() {

            var html =
                '<div class="extra">' +
                    '<a href="#" class="button no_image edit">Edit</a>' +
                    '<a href="#" class="button red no_image delete">Delete</a>' +
                '</div>';

            return html;

        }

    $container.html(trend_html);

    var cnt = 0;
    var loaded = '';

    $container.find('img').error(function(data){

        cnt++;
        check_loaded();

    })
    .load(function(){

        cnt++;

        check_loaded();

    });

    function check_loaded(){

        if(cnt == $container.find('img').length){

            $('#trend_container').masonry({
                columnWidth: 75.5
            });

            loaded = 1;

        }
    }

}

function setup_single_trend(id){

    var trend = $.grep(stored_data.trends, function(e){
        return e.id == id;
    });
    trend = trend[0];

    trend.link_title    = 'trend_' + trend.id + '_' + trend.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');

    // Fills up TREND page (singular)
    var trend_images = '';
    var trend_images_array = trend.images.split(',');

    for(var b=0; b<trend_images_array.length; b++){
        var image = trend_images_array[b];

        trend_images += '<a href="/images/'+ image +'" rel="image_group" class="resize_relative_this fancybox"><img src="/images/'+ image +'" alt="trend image"></a>';

    }

    // Turns retrieved tags into HTML
    var tags_html = '';
    var tags = trend.tags.split(',');
    for(var b=0; b<tags.length; b++){

        tags_html += '<div>' + decodeURIComponent(tags[b]) + '</div>';

    }

    // Turns retrieved categories into HTML
    var categories_html = '';
    var categories = trend.categories.split(',');
    for(var b=0; b<categories.length; b++){

        categories_html += '<div>' + categories[b] + '</div>';

    }

    // Searches the "rater" array to get the array of the current trend
    var rating = trend.rating;

    if(!rating){
        rating                  = [];
        rating.score_cool       = 0;
        rating.score_potential  = 0;
        rating.votes            = 0;
    }

    // Video embedding stuff
        var embed_videos = '';
        if(trend.videos){

            var videos = decodeURIComponent(trend.videos);
                videos = videos.split(',');

            for(var i=0; i<videos.length; i++){

                var video = videos[i];

                if(video.indexOf('youtube') > -1){
                    var video_id = video.split('v=')[1];
                    if(video_id){
                        embed_videos += '<div><iframe width="100%" height="250" src="//www.youtube.com/embed/'+ video_id+ '" frameborder="0" allowfullscreen></iframe></div>';
                    }
                }
                else if(video.indexOf('vimeo')) {
                    var video_id = video.split('.com/')[1];
                    if(video_id){
                        embed_videos += '<div><iframe src="http://player.vimeo.com/video/'+ video_id +'" width="100%" height="250" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>';
                    }
                }

            }
        }

    // Mentality trend get
    var ment_trend = $.grep(stored_data.mentality_trends, function(e){
        return e.id == trend.ment_trend;
    });
    ment_trend = ment_trend[0];

    var trend_single =
        '<div data-role="content">' +
            '<div class="container trend_single">' +
                '<div class="row-fluid">' +
                    '<div class="span10 offset1">' +
                        '<h1>'+ trend.title +'</h1>' +
                        '<div>' +
                            '<div class="row-fluid">' +
                                '<div class="span6">' +
                                    '<div class="image_container">' + trend_images + '</div>' +
                                    '<div class="video_container">' + embed_videos + '</div>' +
                                '</div>' +

                                '<div class="span6" id="trend_description">' +

                                    trend.description +

                                    '<div class="trend_rating">' +
                                        '<label>Rating <span><i>'+ rating.votes +'</i> votes</span></label>' +
                                        '<div>' +
                                            '<section>' +
                                                '<label>How cool is this trend?</label>' +
                                                '<div class="raty" data-score="'+ (rating.score_cool / rating.votes) +'" data-votes="'+ rating.votes +'" data-users="'+ rating.user_ids +'"></div>' +
                                            '</section>' +
                                            '<section>' +
                                                '<label>Future growth potential?</label>' +
                                                '<div class="raty" data-score="'+ (rating.score_potential / rating.votes) +'" data-votes="'+ rating.votes +'" data-users="'+ rating.user_ids +'"></div>' +
                                            '</section>' +
                                        '</div>' +
                                        '<div class="message red">Thanks for rating.</div>' +
                                        '<a href="#" class="button" id="raty_submit" data-role="disable">Submit rating</a>' +
                                    '</div>' +

                                    '<label>Tags</label>' +
                                    '<div class="tags">' + tags_html + '</div>' +

                                    '<label>Categories</label>' +
                                    '<div class="tags">' + categories_html + '</div>' +

                                    '<label>Mentality trend</label>' +
                                    '<div class="tags"><div>' + ment_trend.name + '</div></div>' +

                                    '<label>Author</label>' +
                                    '<div class="trend_author_info">' +
                                        '<img src="/style/images/default_profile_image.jpg" alt="Profile" id="trend_author_image" />' +
                                        '<div id="trend_author_name"><span class="label">Name:</span> <span class="info">John Doe</span></div>' +
                                        '<div id="trend_author_location"><span class="label">Location:</span> <span class="info">Jamaicanana</span></div>' +
                                        '<div id="trend_author_num_articles"><span class="label"># articles:</span> <span class="info">56</span></div>' +
                                    '</div>' +

                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="trend_comments"></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';

    $('#view_trend').html(trend_single);

    // Make links in description open in new window
    $('#trend_description').find('a').attr('target', '_blank');

    // Load trend author info
    $.post('../php/get_account_info.php', {
        user_id: trend.user_id
    }, function(data){

        var author = data;

        var trends_by_author = $.grep(stored_data.trends, function(e){
            return e.user_id == author.id;
        });

        if(author.profile_image){
            $('#trend_author_image')        .attr('src', '/images/'+ author.profile_image);
        }

        $('#trend_author_name')         .find('.info').text(author.first_name +' '+ author.last_name);
        $('#trend_author_location')     .find('.info').text(author.city +', '+ author.country);
        $('#trend_author_num_articles') .find('.info').text(trends_by_author.length);

    }, 'JSON');

    // Setup plugins
        setup_comments();
        setup_raty();
        setup_images();

    // ---------------------------
        function setup_images(){

            setTimeout(function(){
                setup();
            },400);

            $(window).resize(function(){
                setup();
            });

            function setup(){
                var $relative = $('.resize_relative_this');

                var width = $relative.width();
                var height = width * 0.6875;

                $relative.height(height);
            }

        }
        function setup_comments(){
            $('#view_trend').find('.trend_comments').comments({
                trend_id: id,
                author  : {
                    id:             stored_data.user_info.id, // Gotten from global object of "user_info", created when logged in
                    username:       stored_data.user_info.username,
                    image:          stored_data.user_info.profile_image
                },
                onsubmit: function(){
                    load_ajax('reload'); // Reloads the ajax, so that if the same trend will be opened without refresh that it gets the new comment
                }
            });
        }
        function setup_raty() {
            $('.raty').raty({
                path        : '/style/images/icons/',
                starOn      : 'star_red.png',
                starOff     : 'star_grey.png',
                starHalf    : 'star_half.png',
                number      : 10,
                halfShow    : true,
                size        : 17,
                hints       : ['bad', 'poor', 'regular', 'good', 'amazing'],
                click       : function() {

                    var $container = $('.trend_rating');
                    var $raty_cool      = $container.find('.raty').eq(0);
                    var $raty_potential = $container.find('.raty').eq(1);

                    var score_cool      = $raty_cool.find('input[name="score"]').val();
                    var score_potential = $raty_potential.find('input[name="score"]').val();

                    if(score_cool && score_potential){
                        enable_link('#raty_submit');
                    }

                },
                readOnly    : function() {
                    var user_ids = $(this).attr('data-users');
                    user_ids = user_ids.split(',');

                    if(user_ids.indexOf(stored_data.user_info.id) != -1) { // Check if the currently logged in user id is contained in the "rated" people section
                        $(this).parents('.trend_rating').find('.message').text('You have already rated.').addClass('show');
                        $(this).parents('.trend_rating').find('a.button').hide(0);
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                score       : function() {
                    return $(this).attr('data-score');
                }
            });

            var $container = $('.trend_rating');
            $container.find('a.button').click(function(){

                var $raty_cool      = $container.find('.raty').eq(0);
                var $raty_potential = $container.find('.raty').eq(1);

                var score_cool      = $raty_cool.find('input[name="score"]').val();
                var score_potential = $raty_potential.find('input[name="score"]').val();

                if(!score_cool || !score_potential){
                    site_message('You must give both ratings to submit.');
                    return;
                }

                $.post('../php/submit_rating.php', {
                    trend_id        : id,
                    user_id         : stored_data.user_info.id,
                    score_cool      : score_cool,
                    score_potential : score_potential
                }, function(data){

                    $raty_cool
                        .raty('score', data.score_cool)
                        .raty('readOnly', true);

                    $raty_potential
                        .raty('score', data.score_potential)
                        .raty('readOnly', true);

                    $container.children('label').find('i').text(data.votes); // Change the number of votes dynamically
                    $container.find('a.button').hide(0);
                    $container.find('.message').addClass('show'); // Show message

                    load_ajax('reload');

                }, 'JSON');

            });

        }

    // ----------------------------------

    single_trend_loaded = 1;

}

function setup_explore(reload){

    if(reload){
        setup();
    }
    else {
        // Get original resolution, desktop or mobile
        if($(window).width() > 769){
            var orig_size = 'desktop';
        }
        else {
            var orig_size = 'mobile';
        }

        setup(1);

        $(window).resize(function(){

            setup();

        });
    }

    function setup(first_setup){

        if($(window).width() > 769){
            var now_size = 'desktop';
        }
        else {
            var now_size = 'mobile';
        }

        if(now_size !== orig_size || first_setup){ // On resolution change || first_setup

            // Only on desktops
            if(now_size == 'desktop'){

                if($(window).width() > 769){
                    $('#explore').css({ // This one and the one below are necessary to le the plugin init normally whilst the element is invisible
                        display: 'block',
                        visibility: 'hidden'
                    });

                    // Smooth div scrolling (for the explore list)
                    $("#image_list").smoothDivScroll({
                        mousewheelScrolling: "allDirections",
                        hotSpotScrolling: true,
                        hotSpotScrollingStep: 10,
                        manualContinuousScrolling: false,
                        touchScrolling: true,
                        getContentOnLoad: {
                            method: "getAjaxContent",
                            content: "../php/get_trend_list.php",
                            manipulationMethod: "replace"
                        },
                        addedAjaxContent: function(){
                            $("img.lazyload").lazyload({
                                effect      : 'fadeIn',
                                container   : $('.scrollWrapper')
                            });
                        }
                    });

                    $('#explore').removeAttr('style');

                }
            }

            // Mobile devices
            else if(now_size == 'mobile') {

                if(orig_size == 'desktop'){
                    $("#image_list").smoothDivScroll('destroy');
                }

                $.post('../php/get_trend_list.php', {
                    mobile_ver: true
                }, function(data){

                    $('#image_list').html(data);
                    $("img.lazyload").lazyload({
                        effect      : 'fadeIn',
                        container   : $('#image_list')
                    });

                }).error(function(data){
                    console.log(data);
                });

            }

            orig_size = now_size;

        }

    }

}

function submit_account_edit(){

    var first_name  = $('#edit_first_name')     .val();
    var last_name   = $('#edit_last_name')      .val();
    var gender      = $('#edit_gender')         .val();

    var email       = $('#edit_email')          .val();
    var city        = $('#edit_city')           .val();
    var country     = $('#edit_country')        .val();

    var date_1      = $('#edit_date_of_birth_1').val();
    var date_2      = $('#edit_date_of_birth_2').val();
    var date_3      = $('#edit_date_of_birth_3').val();

    var date        = date_3+'-'+date_2+'-'+date_1;

    var password    = $('#edit_password')       .val();

    // AJAX time
    $('#edit_profile_form').ajaxSubmit({
        url: '../php/edit_account_info.php',
        data: {
            account_id      : stored_data.user_info.id,

            first_name      : first_name,
            last_name       : last_name,
            date_of_birth   : date,
            gender          : gender,
            email           : email,
            city            : city,
            country         : country,
            password        : password
        },
        success: function(data){

            // Reset some stuff

            $('#edit_password_old') .val('').keyup().attr('data-pass', md5(password));
            $('#edit_password')     .val('').keyup();
            $('#edit_conf_password').val('').keyup();

            // --

            show_create_page(1);

            if(data){
                // If new profile image
                if(data.hasOwnProperty('profile_image')){
                    $('#account_profile').attr('src', data.profile_image);
                }

                // If new password
                if(data.hasOwnProperty('password')){
                    $.cookie('password_cookie', data.password)
                }
            }

        },
        dataType: 'json'
    });

}

function setup_account_edit_page(){

    var info = stored_data.user_info;

    $('#edit_username')     .val(info.username);
    $('#edit_first_name')   .val(info.first_name);
    $('#edit_last_name')    .val(info.last_name);
    $('#edit_gender')       .val(info.gender).change().parent().removeClass('cross').addClass('tick');

    $('#edit_email')        .val(info.email);
    $('#edit_city')         .val(info.city);
    $('#edit_country')      .val(info.country).change().parent().removeClass('cross').addClass('tick');

    $('#edit_date_of_birth_1').val(info.date_of_birth.split('-')[2]);
    $('#edit_date_of_birth_2').val(info.date_of_birth.split('-')[1]);
    $('#edit_date_of_birth_3').val(info.date_of_birth.split('-')[0]);

    $('#edit_password_old').attr('data-pass', info.password);

    disable_given_links();
    form_stuff(1);
    setup_form_buttons();

    // Setup password stuff
    $('#edit_password_old').removeClass('cross').addClass('cross_perm').keyup(function(){

        // When old password is inserted and it's correct
        if(md5($(this).val()) == $(this).attr('data-pass')){
            $(this).removeClass('cross_perm').addClass('tick');
        }
        else {
            $(this).removeClass('tick').addClass('cross_perm');
        }

    });


}

function account_logout(){

    $.removeCookie('username_cookie');
    $.removeCookie('password_cookie');
    window.location = ''; // On logout of facebook go back home

}

function setup_logged_in_stuff(new_login){

    load_logged_in_ajax(new_login);
    setup_account_stuff();

}

function setup_account_stuff(){

    // Setup username (settings panel)
        $('#account_username').text(stored_data.user_info.username);

    // Setup profile picture (settings panel)
        var img_src = '/images/'+stored_data.user_info.profile_image;

        if(UrlExists(img_src) && stored_data.user_info.profile_image){
            $('#account_profile').attr('src', img_src);
            $('#edit_profile_image_thumbnail').attr('src', img_src);
        }

}

function delete_trend(clicked){

    var $clicked_trend = $(clicked).parent('div').parent('div');
    var id = $clicked_trend.attr('data-id');

    if(confirm('Are you sure you want to remove this trend?')){
        $.post('../php/delete_trend.php', {
            trend_id: id
        });

        $clicked_trend.fadeOut(200);
    }

}

function edit_trend(clicked){

    reset_edit_trend_form();

    var $clicked = $(clicked);

    var $clicked_trend = $clicked.parent('div').parent('div');
    var id = $clicked_trend.attr('data-id');

    var trends = stored_data.trends; // gotten from database

    var trend = $.grep(trends, function(e){
        return e.id == id;
    });
    trend = trend[0];

    // Sets up title & description
    $('#edit_trend_title')  .val(trend.title);
    tinyMCE.get('edit_trend_description')    .setContent(trend.description);

    // Sets videos
        var $container          = $('#edit_trend_videos');
        var $container_input    = $container.children();

        var videos = decodeURIComponent(trend.videos);
        videos = videos.split(',');

        if(trend.videos){
            for(var i=0; i<videos.length; i++){

                var video = videos[i];
                $container.append(
                    $container_input.clone().val(video).removeClass('cross').addClass('tick')
                );
            }
            $container.append($container_input); // Adds the input to the bottom of the list instead of staying up top
        }

    // Sets website link
    $('#edit_trend_website').val(trend.website);

    // Sets tags
    var tags = trend.tags.split(',');
    for(var i=0; i<tags.length; i++){
        var tag = decodeURIComponent(tags[i]);
        $('#edit_trend_tagger').addTag(tag);
    }

    // Sets categories
    var categories = trend.categories.split(',');
    for(var i=0; i<categories.length; i++){
        var category = decodeURIComponent(categories[i]);
        $('#edit_trend_categories').find('div:contains('+category+')').addClass('selected');
    }

    // Sets location
    $('#edit_trend_location')   .val(trend.location); // Calls keyup to enable the SUBMIT button

    // Sets trend_id
    $('#edit_trend_id')         .val(trend.id);

    $('#edit_trend_workspaces') .val(trend.research_project).change();
    $('#edit_trend_ment_trends').val(trend.ment_trend).change();

    form_stuff(1);
    setup_form_buttons();

    $.mobile.changePage('#edit_trend_1', 'pop');

}

function submit_register(){
    var first_name      = $('#reg_first_name').val();
    var last_name       = $('#reg_last_name').val();
    var username        = $('#reg_username').val();
    var date_of_birth   = $('#reg_date_of_birth_3').val() +'-'+ $('#reg_date_of_birth_1').val() +'-'+ $('#reg_date_of_birth_1').val();
    var gender          = $('#reg_gender').val();
    var password        = $('#reg_password').val();
    var email           = $('#reg_email').val();
    var city            = $('#reg_city').val();
    var country         = $('#reg_country').val();
    $.post('../php/submit_register.php', {
        first_name      : first_name,
        last_name       : last_name,
        username        : username,
        date_of_birth   : date_of_birth,
        gender          : gender,
        password        : password,
        email           : email,
        city            : city,
        country         : country
    }, function(data){

        $.cookie('username_cookie', username);
        $.cookie('password_cookie', data); // Returns the MD5d password

        $.mobile.changePage('#create', {
            reloadPage : true
        });

    });
}

function submit_login(){
    var username = $('#login_username').val();
    var password = $('#login_password').val();

    $.post('../php/check_login.php', {
        username: username,
        password: password,
        md5     : 1
    }, function(data){

        if(data){ // good

            $.extend(stored_data, data); // Updates the stored_data to hold the user information

            $.cookie('username_cookie', stored_data.user_info.username);
            $.cookie('password_cookie', stored_data.user_info.password);

            logged_in = stored_data.user_info ? 1 : 0; // Sets the "logged_in" attribute

            setup_explore(1); // If premium user, then the explore will change to show premium content
            setup_logged_in_stuff(1); // Continues onward (the 1 is to tell the script that it's a new login (don't start "load_rest()"))

            show_create_page(1);

        }
        else { // bad
            site_message('Invalid username or password.');
        }

    }, 'JSON');

}

function check_if_allowed_page(){

    var allowed_page = '';

    if(
        !location.hash                              || // Home page
        $.cookie('view_type')    == 'explore'       || // Trend page
        location.hash       == '#explore'           || // Explore page
        location.hash       == '#about'             || // About page
        location.hash       == '#login_with_account'|| // Login page
        location.hash       == '#register_1'        || // Register page
        location.hash       == '#register_2'        || // Register page
        location.hash       == '#register_3'        || // Register page
        location.hash       == '#terms_of_service'           // Terms of service
    ){
        allowed_page = 1
        $('#new_icon').addClass('hide');
    }

    if(logged_in){
        allowed_page = 1;
        $('#new_icon').removeClass('hide');
    }

    if(!allowed_page){
        window.location = '/';
    }

}

function reset_new_trend_form(){

    $('#uploaded_images_field')                 .val('');
    $('#mobile_trend_images_upload').find('form').not(':last-child').remove();

    $('#new_trend_title')                       .val('').removeClass('tick').addClass('cross');
    tinyMCE.get('new_trend_description')        .setContent('');
    $('.new_trend_video').not(':first-child')   .remove();
    $('.new_trend_video')                       .val('').removeClass('tick').addClass('cross');

    $('#new_trend_website')                     .val('').removeClass('tick').addClass('cross');

    $('#new_trend_categories')                  .find('div').removeClass('selected');
    $('#new_trend_tagger')                      .importTags('');
    $('#new_trend_workspaces')                  .val('').change().parent().removeClass('tick').addClass('cross');
    $('#new_trend_ment_trends')                 .val('').change().parent().removeClass('tick').addClass('cross');

}


function reset_edit_trend_form(){

    $('#edit_trend_title')                      .val('').removeClass('tick').addClass('cross');
    tinyMCE.get('edit_trend_description')       .setContent('');

    $('.edit_trend_video').not(':first-child')  .remove();
    $('.edit_trend_video')                      .val('');

    $('#edit_trend_website')                    .val('').removeClass('tick').addClass('cross');

    $('#edit_trend_categories')                 .find('div').removeClass('selected');
    $('#edit_trend_tagger')                     .importTags('');
    $('#edit_trend_workspaces')                  .val('').removeClass('tick').addClass('cross');
    $('#edit_trend_ment_trends')                .val('').change().removeClass('tick').addClass('cross');

}

function go_home(on_back, reload){

    if(on_back){ // Goes home on back click

        window.onpopstate = function(event){ // HTML5 function that gets the page change info

            if(!event.state) return; // Does nothing if not going back, cause state is empty

            if(event.state.direction == 'back'){

                go();

            }

        }

    }
    else { // Goes home immediately

        go();

    }

    function go(){

        var where = '';

        if($.cookie('view_type') == 'explore'){
            where = $('#explore');
        }
        else {
            where = $('#create');
        }

        jQuery.mobile.changePage(
            where,
            {
                transition  : 'slide',
                reverse     : true
            }
        );

        // Cancels the default behaviour of the back button
            $(document).bind("pagebeforechange", function(e) {
                e.preventDefault();
            });

        // Re-enables the default page behaviour
            setTimeout(function(){
                $(document).unbind("pagebeforechange");
            }, 1000);

    }

}

function load_logged_in_ajax(new_login){

    var $container  = $('#research_projects').find('.research_projects');
    var $container2 = $('#new_trend_workspaces, #edit_trend_workspaces');

    if(stored_data.user_info.project_ids){

        $.post('../php/get_logged_in_info.php', {
            project_ids: stored_data.user_info.project_ids
        },function(data){

            $.extend(stored_data, data);

            var projects = stored_data.research_projects; // Updates the stored data with "research_projects"

            // Loop per research project
            for(var i=0; i<projects.length; i++){

                var project = projects[i];

                project.link_title = 'view_project?id=' + project.id + '&name=' + project.name.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');

                $container.append(
                    '<a href="#'+ project.link_title +'"  data-transition="slide" class="button no_image">' +
                        '<span>'+ (i+2) +'.</span> '+ project.name +
                    '</a>'
                );

                $container2.append('<option value="'+ project.id +'">'+ project.name +'</option>');


            }

            // Calls on page load, not on new login
            if(!new_login){
                load_rest();
            }

        }, 'JSON');

    }
    else {

        $container.append('<div class="message show no_float red">No workspaces...</div>');

        if(!new_login){
            load_rest();
        }

    }

    setup_account_edit_page();

}

function global_page_functions(first_load){

    if(first_load){

        if(if_not_home_page()){

            jQuery.mobile.changePage( $.cookie('view_type') ? $( '#'+ $.cookie('view_type') ) : $('#create') );

        }

    }

    disable_given_links();

    // If logged in, there is never a need for the slideshow
    if(!logged_in){
        setup_slideshow();
    }
    else {
        setup_slideshow(1); // 1 removes the slideshow as a whole
    }

    if(logged_in){
        show_create_page();
    }

    // HOME
    if(!location.hash) {

        if(logged_in) {  // If logged in, then forwards the user to the CREATE page

            show_create_page(1, 1); // Will cause a page refresh

        }
        else {
            $.removeCookie('view_type');
        }

        $header.addClass('home');
        $footer.addClass('home');

    }

    // Not home page
    else {

        if(location.hash !== '#create' && location.hash !== '#explore'){

            $footer.addClass('hide');
            $('#new_icon').removeClass('show'); // Hide "new_trend_button"

        }
        else {
            if(location.hash == '#create'){ // Changes the cookie to "create"
                $.cookie('view_type', 'create');

                $('#new_icon').addClass('show'); // Show "new_trend_button"

            }
            if(location.hash == '#explore'){ // Changes the cookie to "explore"

                $.cookie('view_type', 'explore');

            }
            $footer.removeClass('hide');
        }

        check_if_allowed_page(); // Checks if this is an allowed page for NOT logged in users

        if(if_single_trend_page()){ // If opened website on trend, redirect to EXPLORE
            if(!single_trend_loaded){
                $.mobile.changePage('#explore', 'pop');
            }
        }

        // Change header
        $header.removeAttr('class').addClass($.cookie('view_type'));

        // Move footer and home_image back down to be "normal"
        $footer.removeClass('reveal home');
        $('#home_image').removeClass('move');

        var view = $.cookie('view_type'); // Gets either "create" or "explore"

        $footer.find('.selected').removeClass('selected'); // Remove class
        $footer.find('#'+view+'_button').addClass('selected'); // Add class

        if($('body').hasClass('open_panel'))$('body').removeClass('open_panel'); // Makes the side panel hide on page change

    }

    // Back button or menu button (top-left)
    // Menu button
    if(location.hash == '#create' || location.hash == '#explore'){

        // Back button hide
        $('#back_icon').hide(0);

        if(logged_in){
            $('#menu_icon').show(0);
        }
        else {
            $('#menu_icon').hide(0);
        }

        // Logo show, title hide
        $('#header_logo').show(0);
        $('#header_title').hide(0);

    }

    if(!location.hash){

        // Logo show, title hide
        $('#header_logo').show(0);
        $('#header_title').hide(0);

        // Back button hide
        $('#back_icon').hide(0);
        $('#menu_icon').hide(0);

        $footer.addClass('home').removeClass('hide').children('a').removeClass('selected');

    }

    // If any page other than HOME and #create & #explore
    if(location.hash && location.hash !== '#create' && location.hash !== '#explore'){

        // Back button show
        $('#menu_icon').hide(0);
        $('#back_icon').show(0);

        if(location.hash == '#insufficient_privilages'){
            $('#menu_icon').show(0);
            $('#back_icon').hide(0);
        }


        if(view == 'explore') { // EXPLORE - Single trend page

            go_home(1); // Goes home on back click (EXPLORE page)

        }

        if(!if_single_trend_page()){
            // Logo hide, title show
            $('#header_logo').hide(0);
            $('#header_title').show(0).text('');
        }
        else {
            // Logo show, title hide
            $('#header_logo').show(0);
            $('#header_title').hide(0);
        }


    }

    // Always change the #header_title accordingly
    $('#header_title').text(document.title);

}

function loader(type){

   if(type == 'hide'){
       $header                      .fadeIn(200);
       $footer                      .fadeIn(200);

       $('#page_loading')           .fadeOut(200);
   }

    if(type == 'show') {
       $header                      .fadeOut(200);
       $footer                      .fadeOut(200);

       $('#page_loading')           .fadeIn(200);
   }

}

function submit_trend(){

    // Info
        var title           = $('#new_trend_title')                 .val();
        var description     = tinyMCE.get('new_trend_description')  .getContent();

        var videos          = get_multiple_inputs('.new_trend_video');

        var website         = $('#new_trend_website')               .val();
        var location        = $('#new_trend_location')              .val();

        var tags            = get_tags('#new_trend_tagger_tagsinput');
        var categories      = get_categories('#new_trend_categories');
        var workspace       = $('#new_trend_workspaces')            .val();
        var ment_trend      = $('#new_trend_ment_trends')           .val();

        var uploaded_images = $('#uploaded_images_field')           .val();

    // Submit info
        $.post('../php/submit_trend.php', {
            user_id         : stored_data.user_info.id,
            uploaded_images : uploaded_images,

            title           : title,
            description     : description,
            videos          : videos,
            website         : website,
            location        : location,

            tags            : tags,
            categories      : categories,
            workspace       : workspace,
            ment_trend      : ment_trend
        }, function(data){

            // Insert into array
            stored_data.trends.push(data.trend);

            setup_single_trend(data.trend.id);

            $.mobile.changePage('#view_trend', 'pop');

            site_message('You have successfully submitted your trend.');

            $.cookie('view_type', 'explore'); // Makes sure that the back button will take the user to the explore page by changing the cookie

            // The back button will take the user HOME
            go_home(1);

            // Reset new trend form (in case the user wants to add another new trend)
            reset_new_trend_form();

        }, 'JSON');

}

// --- Get stuff ---
    function get_multiple_inputs(els) {

        var vals = '';

        var $els = $(els);

        for(var i=0; i<$els.length; i++){

            var $el = $els.eq(i);

            if($el.val()){
                vals += $el.val() +',';
            }

        }
        vals = vals.substring(0, vals.length - 1);

        return vals;

    }

    function get_tags(container) {

        var tags = '';
        var $tags = $(container).children('span.tag');
        var num     = $tags.length;
        for(var i=0;i<num;i++){

            var tag = '';
            tag = $tags.eq(i).children('span').text();
            tag = trim_whitespace(tag);
            tag = encodeURIComponent(tag);
            tag = tag+',';

            tags += tag;

        }
        tags = tags.substring(0, tags.length - 1);

        return tags;

    }

    function get_categories(container) {

        var categories = '';
        var $categories = $.mobile.activePage.find(container).children('div.selected');
        var num = $categories.length;

        for(var i=0; i<num; i++){

            var $category = $categories.eq(i);
            var  category = $category.text();
            category = encodeURIComponent(category);

            categories += category+',';

        }
        categories = categories.substring(0, categories.length - 1);

        return categories;

    }

function setup_form_buttons() {

    // ----- forms -----

    if(
        $('#reg_first_name')                .hasClass('tick') &&
        $('#reg_last_name')                 .hasClass('tick') &&
        $('#reg_username')                  .hasClass('tick') &&
        $('#reg_gender').parent('.select')  .hasClass('tick') &&
        $('#reg_password')                  .hasClass('tick') &&
        $('#reg_conf_password')             .hasClass('tick')
    ){
        enable_link('#register_2_button');
    }
    else {
        disable_link('#register_2_button');
    }

    if(
        $('#reg_email')                     .hasClass('tick') &&
        $('#reg_city')                      .hasClass('tick') &&
        $('#reg_country').parent('.select') .hasClass('tick')
    ){
        enable_link('#register_3_button');
    }
    else {
        disable_link('#register_3_button');
    }

    if(
        $('#reg_date_of_birth_1')       .hasClass('tick') &&
        $('#reg_date_of_birth_2')       .hasClass('tick') &&
        $('#reg_date_of_birth_3')       .hasClass('tick') &&
        $('#reg_terms_of_service')      .is(':checked')
    ){
        enable_link('#submit_registration_button');
    }
    else {
        disable_link('#submit_registration_button');
    }

    if(
        $('#new_trend_title')                   .hasClass('tick') &&
        tinyMCE.get('new_trend_description')    .getContent()     &&
        $('#new_trend_location')                .hasClass('tick')
    ){
        enable_link('#new_trend_3_button');
    }
    else {
        disable_link('#new_trend_3_button');
    }

    if(
        $('#new_trend_tagger_tagsinput')                .hasClass('tick')         &&
        $('#new_trend_categories')                      .find('.selected').length &&
        $('#new_trend_workspaces').parents('.select')  .hasClass('tick')          &&
        $('#new_trend_ment_trends').parents('.select')  .hasClass('tick')
    ){
        enable_link('#submit_new_trend');
    }
    else {
        disable_link('#submit_new_trend');
    }

    if(
        $('#edit_trend_title')                  .hasClass('tick') &&
        tinyMCE.get('edit_trend_description')   .getContent()     &&
        $('#edit_trend_location')               .hasClass('tick')
    ){
        enable_link('#edit_trend_2_button');
    }
    else {
        disable_link('#edit_trend_2_button');
    }

    if(
        $('#edit_trend_tagger_tagsinput')                .hasClass('tick')         &&
        $('#edit_trend_categories')                      .find('.selected').length &&
        $('#edit_trend_workspaces') .parents('.select')  .hasClass('tick')         &&
        $('#edit_trend_ment_trends').parents('.select')  .hasClass('tick')
    ){
        enable_link('#submit_edit_trend');
    }
    else {
        disable_link('#submit_edit_trend');
    }

    if(
        $('#login_username')    .hasClass('tick') &&
        $('#login_password')    .hasClass('tick')
    ){
        enable_link('#submit_login');
    }
    else {
        disable_link('#submit_login');
    }

    if(
        $('#edit_first_name')       .hasClass('tick') &&
        $('#edit_last_name')        .hasClass('tick') &&
        $('#edit_gender').parent()  .hasClass('tick') &&

        $('#edit_email')            .hasClass('tick') &&
        $('#edit_city')             .hasClass('tick') &&
        $('#edit_country').parent() .hasClass('tick') &&

        $('#edit_date_of_birth_1')  .hasClass('tick') &&
        $('#edit_date_of_birth_2')  .hasClass('tick') &&
        $('#edit_date_of_birth_3')  .hasClass('tick')
    ){
        if(
            (
                ( $('#edit_password_old') .hasClass('cross') || $('#edit_password_old') .hasClass('cross_perm') )       &&
                ( $('#edit_password')     .hasClass('cross') || $('#edit_password') .hasClass('cross_perm') )           &&
                ( $('#edit_conf_password').hasClass('cross') || $('#edit_password_password') .hasClass('cross_perm') )
            ) || (
                $('#edit_password_old') .hasClass('tick') &&
                $('#edit_password')     .hasClass('tick') &&
                $('#edit_conf_password').hasClass('tick')
            )
        ){
            enable_link('#submit_account_edit_button');
        }
        else {
            disable_link('#submit_account_edit_button');
        }
    }
    else {
        disable_link('#submit_account_edit_button');
    }

    // --------------

}

function if_single_trend_page(){

    if(location.hash.indexOf('view_trend') > -1){
        return true;
    }
    else {
        return false;
    }

}

function setup_slideshow(disable) {

    if(disable){

        $('#home_image').remove();

        return;

    }

    var $img = $('#home_image').find('img').eq(0); // first image
    var direction = 'right';
    animate_image($img, direction);

    var timeout = 8000;
    full_slideshow();

    setInterval(function(){

        if($img.next().length){ // if we can get the NEXT image
            var $next = $img.next('img');
        }
        else { // otherwise use the first again
            var $next = $img.prevAll('img').last(); // gets the first
        }

        if(direction == 'right')    direction = 'left';
        else                        direction = 'right';

        // Set the $next image CSS left so that the image is on its right side
        if(direction == 'left'){
            $next.css({
                left: -($next.width() - $(window).width())
            });
        }


        $img.fadeOut(1600);
        $next.fadeIn(1600);

        $img = $next;

        animate_image($img, direction);

        full_slideshow();

    }, timeout);

    function full_slideshow() {

        // Initialize the resizing of the slideshow (only once)
        if(typeof(resize_slideshow) == 'undefined'){

            $(window).resize(function(){
                full_slideshow();
            });
            resize_slideshow = 1;

        }

        // Set variables
        var orig_img_height = $img.height() * 0.85;
        var orig_img_width  = $img.width() * 0.85;

        var window_height = $(window).height();
        var window_width  = $(window).width();

        var img_height = window_height;
        var img_width  = ( img_height / orig_img_height ) * orig_img_width;

        // If we need image to be bigger than original
        if(img_width < window_width){

            img_width  = window_width;

            // Sets the height correctly so that the image doesn't look stretched
            var new_img_height = (img_width / orig_img_width) * orig_img_height;
            if(new_img_height > img_height){

                img_height = new_img_height;

            }

        }

        $img
            .height(img_height * 1.15)
            .width(img_width * 1.15)
            .css({
                maxWidth: 'none'
            });

    }


    function animate_image($img, direction){

        if(direction == 'right'){
            var movement = $img.width() - $(window).width();
        }
        else if(direction == 'left') {
            var movement = 0;
        }

        move_image(-movement);

        function move_image(movement){

            $img.animate({
                left: movement
            }, 7000, 'easeInOutSine');

        }

    }

}

// -------- Collection of different functions ---------


/** Function count the occurrences of substring in a string;
 * @param {String} string   Required. The string;
 * @param {String} subString    Required. The string to search for;
 * @param {Boolean} allowOverlapping    Optional. Default: false;
 */
function num_occurrences(string, subString, allowOverlapping){

    string+=""; subString+="";
    if(subString.length<=0) return string.length+1;

    var n=0, pos=0;
    var step=(allowOverlapping)?(1):(subString.length);

    while(true){
        pos=string.indexOf(subString,pos);
        if(pos>=0){ n++; pos+=step; } else break;
    }
    return(n);
}

// If u supply a string and param name, it will give the param value
$.textParam = function(param, string){
    var results = new RegExp('[\\?&]' + param + '=([^&#]*)').exec(string);
    return results[1] || 0;
}

// Disable links
function disable_given_links() {
    var num = $('a[data-role="disable"]').length;
    for(var i=0;i<num;i++){

        var href = $('a[data-role="disable"]').eq(i).attr('href');

        // Removes the href="" and turns it into c_href=""
        if(href){
            $('a[data-role="disable"]').eq(i).attr('c_href', href).attr('href', '');
        }

    }
}

// Enable links
function enable_link(id){

    var href = $(id).attr('c_href');
    if(href){
        $(id).attr('c_href','').attr('data-role','');
        $(id).attr('href', href);
    }

}

// Enable links
function disable_link(id){

    var href = $(id).attr('href');
    if(href){
        $(id).attr('href','').attr('data-role','disable');
        $(id).attr('c_href', href);
    }

}

function trim_whitespace (s) {
    s = s.replace(/(^\s*)|(\s*$)/gi,"");
    s = s.replace(/[ ]{2,}/gi," ");
    s = s.replace(/\n /,"\n"); return s;
}

function truncate(string, number, use_word_boundary){
    var toLong = string.length > number,
        s_ = toLong ? string.substr(0,number-1) : string;
    s_ = use_word_boundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
    return  toLong ? s_ + '&hellip;' : s_;
}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

// ---------------------------------------------------