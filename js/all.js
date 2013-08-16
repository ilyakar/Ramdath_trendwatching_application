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

        // Init global_page_functions on start AND page change
        on_page_change();

        // Global click functions
        global_click_functions();

        // Plugin setup
        setup_other_plugins();

        // Form stuff
        form_stuff();

        // Show app
        show_app();

    }

// ------------------------------ Primary setup ------------------------------

function setup_definitions() {

    logged_in                       = '';

    $header                         = $('#main_header');
    $footer                         = $('#main_footer');

    first_load                      = '';
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
                var $uploaded_field = $('#uploaded_images_field');

                var uploaded_files = $uploaded_field.val();

                if(uploaded_files)  $uploaded_field.val(uploaded_files+','+filename);
                else                $uploaded_field.val(filename);
                // --

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
                    $('#uploaded_images_field').val('');
                    _this.removeAllFiles();
                    disable_link('#new_trend_2_button');
                }, 1000);

            })
        }
    };

    tinymce.init({
        selector: "textarea#new_trend_description",
        plugins: [
            "link"
        ],

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

    window.fbAsyncInit = function() {
        console.log('setting up facebook API');
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

    }

}

function load_ajax(new_login){

    $.post('php/get_info.php', function(data){

        // Store the data in a constant
            $.extend(stored_data, data);

        var categories          = data.categories;
        var trends              = data.trends;
        var rater               = data.rater;
        var ment_trends         = data.mentality_trends;

        // -- Categories --
            var $container  = $('#new_trend_categories, #edit_trend_categories');
            var $container2 = $('#filter_by').find('div[data-d-id="category"]');

            for(var i=0; i<categories.length; i++){

                // Trend
                    var category = categories[i];
                    $container.append(
                        '<div>' +
                            category.name +
                        '</div>'
                    );

                // #filter_by
                    $container2.append(
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

        // -- Mentality trends --
            for(var i=0; i<ment_trends.length; i++){
                var ment_trend = ment_trends[i]
                $('#new_trend_ment_trends').append('<option value="'+ ment_trend.name.toLowerCase() +'">'+ ment_trend.name +'</option>');
            }

        if(logged_in){
            setup_logged_in_stuff(new_login); // Continues onward | load rest is fired when the function finished
        }
        else {
            load_rest();
        }

    }, 'JSON');

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
    img14.src = '/style/images/raty_star_half.png';
    img15.src = '/style/images/raty_star_off.png';
    img16.src = '/style/images/raty_star_on.png';
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


        function start_ajax(username, password, md5, type, extra_info) {
console.log('ajax started');
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

                    if(type == 'facebook'){ // Sets the cookies here cause it needs to get the pass from DB
                        $.cookie('username_cookie', stored_data.user_info.username);
                        $.cookie('password_cookie', stored_data.user_info.password);
                    }

                    logged_in = 1;

                    if(type == 'facebook'){
                        load_ajax(1); // 1 is for (new_login), so that "load_rest()" isn't fired once more
                        FB.logout(); // Got the data, got the cookies. Now logout from facebook. No more need for it
                        $.mobile.changePage('#create', 'pop');
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

    global_page_functions();

    // Runs on page change
    $(document).delegate('.ui-page', 'pagebeforeshow', function () {
        console.log('page change');
        global_page_functions();
    });

}

function global_click_functions() {

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

    $('#research_projects').find('.research_projects').find('a').click(function(data){
        setup_research_project_click(data);
    })

    $('#filter_by').find('li').children('a').click(function(){

        var type                    = $(this).parents('div').attr('data-d-id');
        var $container              = $('#image_list');
        var $container_untouched    = $('#image_list_copy');

        // Clones the image_list on first click
            if(!$container_untouched.html()){

                $container_untouched.html($container.find('.scrollableArea').html());
            }

        $container.find('.scrollableArea').html($container_untouched.html());

        // Adds the .active class

            // Resets the active class
                $('a[data-d-id]:not([data-d-id="'+ type +'"])').removeClass('active');
                $('div[data-d-id]:not([data-d-id="'+ type +'"])').find('a.active').removeClass('active'); // Removes ".active" from elements outside current type

            var $actives = $(this).parents('div[data-d-id]').find('a.active');
            if(type !== 'category' && $actives.length){
                $actives.not(this).removeClass('active');
            }

            if(!$(this).hasClass('active')){ // Adds the .active class if it didn't yet exist
                $(this).addClass('active');
            }
            else { // Removes the .active class if it exists
                $(this).removeClass('active');
            }

            if($(this).parents('div[data-d-id]').find('a.active').length){ // Adds .active class to the main button
                $('#filter_by').children('a[data-d-id="'+ type +'"]').addClass('active');
            }
            else { // Removes .active class from the main button
                $('#filter_by').children('a[data-d-id="'+ type +'"]').removeClass('active');
            }

        // Specific filter functions
            if(type == 'category'){

                var attributes = '';
                var els = $(this).parents('div[data-d-id]').find('a.active');
                for(var i=0; i<els.length; i++){
                    var el = els.eq(i);
                    attributes += '[data-categories*='+ el.text() +']';
                }

                if(attributes){
                    $container.find('div[data-categories]:not('+ attributes +')').remove();
                }

            }
            else if(type == 'popularity'){

                var value = $(this).text().toLocaleLowerCase();

                if(value == 'views'){
                    var attr= 'data-views';
                }
                else if(value == 'rating'){
                    var attr = 'data-rating';
                }
                else if(value == 'discussions'){
                    var attr = 'data-num-comments';
                }

                if($(this).hasClass('active')){
                    var els = $container.find('['+ attr +']');
                    els.sort(function(a, b) {
                        return parseInt($(b).attr(attr)) - parseInt($(a).attr(attr));
                    });

                    $container.find(attr).remove();
                    $container.find('.scrollableArea').html(els);
                }

            }
            else if(type == 'date'){

            }

        $("#image_list").smoothDivScroll("recalculateScrollableArea");
        $("img.lazyload").lazyload({
            effect      : 'fadeIn',
            container   : $('.scrollWrapper')
        });

    });

    // On menu icon click
    $('#menu_icon').click(function(){

        // Open panel
        if(!$('body').hasClass('open_panel')){
            $('body').addClass('open_panel');
        }
        else {
            $('body').removeClass('open_panel');
        }

    });

    // Login with facebook
    $('#login_with_facebook').click(function(){
        FB.login();
    });

    // Logout
    $('#logout_button').click(function(){
       account_logout();
    });

    // On tag click
    $('.tags').find('div').click(function(){

        $(this).hasClass('selected') ? $(this).removeClass('selected') : $(this).addClass('selected');

    });

    // On new trend submit
    $('#submit_new_trend').click(function(){

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
        $('.research_trends').find('a:contains(Edit)').click(function(){

            edit_trend(this);

        });
        $('.research_trends').find('a:contains(Delete)').click(function(){

            delete_trend(this);

        });

    $('#submit_edit_trend').click(function(){

        if($(this).attr('data-role') == 'disable') return;

        var trend_id    = $('#edit_trend_id')                       .val();
        var title       = $('#edit_trend_title')                    .val();
        var description = $('#edit_trend_description')              .val();
        var tags        = get_tags('#edit_trend_tagger_tagsinput');
        var categories  = get_categories('#edit_trend_categories');
        var location    = $('#edit_trend_location')                 .val();

        // Submit info
        $.post('../php/update_trend.php', {
            trend_id        : trend_id,
            title           : title,
            description     : description,
            tags            : tags,
            categories      : categories,
            location        : location
        },function(data){

            alert('submitted edit'); // todo continue here

        });


    })

}

function setup_other_plugins(){

    // Tag plugin
        $('#new_trend_tagger, #edit_trend_tagger').tagsInput({
            height: '100%',
            onChange: function(){

                var $input = $('#new_trend_tagger_tagsinput');

                if($input.children('span').length)  $input.removeClass('cross').addClass('tick');
                else                                $input.removeClass('tick').addClass('cross');

                setup_form_buttons();

            }
        });

    // Trend filter_by dropdown plugin
        $('#filter_by').dropdown();

    // Lazyload
//        $("img.lazyload").lazyload({
//            effect      : 'fadeIn'
//        });

}

function form_stuff() {

    // Style select options
//    $('select').customSelect();

    // Adds the .cross class to all input fields
    var $input = $('input[type="text"], input[type="password"], textarea, .tagsinput');
    for(var i=0; i<$input.length; i++){

        var $inp = $input.eq(i);
        $inp.val() ? $inp.addClass('tick') : $inp.addClass('cross');

    }

    // Changes form class to either .tick or .cross
    $('input[type="text"], input[type="password"], textarea').keyup(function(){

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
    $('input[data-role="conf-pass"]').keyup(function(){

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
    $('select').change(function(){

        $(this).parents('.select').removeClass('cross').removeClass('tick').addClass('tick');

        setup_form_buttons();

    });

    // Tag stuff
    $('.tagsinput').find('input').focus(function(){

        $(this).parents('.tagsinput').addClass('focus');

    });
    $('.tagsinput').find('input').focusout(function(){

        $(this).parents('.tagsinput').removeClass('focus');

    });

    $('.thumbnail_upload').find('[type="file"]').change(function(){

        if (this.files && this.files[0]) {

            var reader = new FileReader();

            reader.onload = function (e) {
                $('.thumbnail_upload').find('img').attr('src', e.target.result);
            }

            reader.readAsDataURL(this.files[0]);

            setup_form_buttons();
        }

    });

    $('.tags').find('div').click(function(){

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

// ---------------- Other functions (called by other functions) -----------------

function setup_research_project_click(data){

    var id = $.textParam('id', data.currentTarget.hash);

    var project_trends = $.grep(stored_data.trends, function(e){
        return e.research_project == id;
    });

    var trend_html = '';

    // Loop per trend in research project
        for(var i=0; i<project_trends.length; i++) {

            var project_trend = project_trends[i];

            trend_html +=
                '<div data-id="'+ project_trend.id +'">' +
                    '<a href="#'+ project_trend.link_title +'">' +
                        '<div class="image_container">' +
                        '   <img src="/images/'+ project_trend.images.split(',')[0] +'" alt="research project image">' +
                        '</div>' +
                        '<span>'+ truncate(project_trend.title, 30) + '</span>' +
                    '</a>' +
                    add_extra_html() +
                '</div>';

        }
        if(!project_trends.length){

            trend_html += '<div class="message show no_float red">No trends...</div>';

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

    var page_html =
        '<div data-role="content">' +
            '<div class="mega_container research_trends">' +
                trend_html +
            '</div>' +
        '</div>';

    $('#view_project').html(page_html);

    $container = $('.research_trends');

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
        console.log(cnt);
        if(cnt == $container.find('img').length){

            $('.research_trends').masonry({
                columnWidth: 195,
                isFitWidth: true
            });

            loaded = 1;

        }
    }

}

function setup_single_trend_click(){

    $('#image_list').find('.image_container').children('a').click(function(data){
        var id = $.textParam('id', data.currentTarget.hash);
        setup_single_trend(id);
    });

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

        trend_images += '<div><img src="/images/'+ image +'" alt="trend image"></div>';

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

    if(!rating.value) rating.value = 0;
    if(!rating.votes) rating.votes = 0;

    // Video embedding stuff
        var embed_video = '';
        if(trend.video){
            console.log(trend.video);
            if(trend.video.indexOf('youtube') > -1){
                console.log('youtube');
                var video_id = trend.video.split('v=')[1];
                if(video_id){
                    embed_video = '<iframe width="400" height="225" src="//www.youtube.com/embed/'+ video_id+ '" frameborder="0" allowfullscreen></iframe>';
                }
            }
            else if(trend.video.indexOf('vimeo')) {
                console.log('vimeo');
                var video_id = trend.video.split('.com/')[1];
                if(video_id){
                    embed_video = '<iframe src="http://player.vimeo.com/video/'+ video_id +'" width="400" height="225" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
                }
            }
        }

    var trend_single =
        '<div data-role="content">' +
            '<div class="maxi_container trend_single">' +
                '<h1>'+ trend.title +'</h1>' +
                '<div>' +
                    '<div class="left_container">' +
                        '<div class="image_container">' + trend_images + '</div>' +
                        '<div class="video_container">' + embed_video + '</div> ' +
                    '</div>' +

                    '<section>' +

                        trend.description +

                        '<div class="trend_rating">' +
                        '<label>Rating <span><i>'+ rating.votes +'</i> votes</span></label>' +
                        '<div class="raty" data-score="'+ (rating.value / rating.votes) +'" data-votes="'+ rating.votes +'" data-users="'+ rating.user_ids +'"></div>' +
                        '<div class="message red">Thanks for rating.</div>' +
                        '</div>' +

                        '<label>Tags</label>' +
                        '<div class="tags">' + tags_html + '</div>' +

                        '<label>Categories</label>' +
                        '<div class="tags">' + categories_html + '</div>' +

                        '</section>' +
                    '</div>' +

                '<div class="trend_comments"></div>' +

            '</div>' +
        '</div>';

    $('#view_trend').html(trend_single);

    // Setup plugins
        setup_comments();
        setup_raty();
        setup_single_trend_gallery();

    // ---------------------------
        function setup_comments(){
            $('#view_trend').find('.trend_comments').comments({
                trend_id: id,
                author  : {
                    id:             stored_data.user_info.id, // Gotten from global object of "user_info", created when logged in
                    username:       stored_data.user_info.username,
                    image:          stored_data.user_info.profile_image
                }
            });
        }
        function setup_raty() {
            $('.raty').raty({
                path        : '/style/images/',
                starOn      : 'raty_star_on.png',
                starOff     : 'raty_star_off.png',
                starHalf    : 'raty_star_half.png',
                halfShow    : true,
                size        : 22,
                hints       : ['bad', 'poor', 'regular', 'good', 'amazing'],
                readOnly    : function() {
                    var user_ids = $(this).attr('data-users');
                    user_ids = user_ids.split(',');

                    if(user_ids.indexOf(stored_data.user_info.id) != -1) { // Check if the currently logged in user id is contained in the "rated" people section
                        $(this).parent().find('.message').text('You have already rated.').addClass('show');
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                score       : function() {
                    return $(this).attr('data-score');
                },
                click       : function(num) {

                    $.post('../php/submit_rating.php', {
                        trend_id    : id,
                        user_id     : stored_data.user_info.id,
                        rating      : num
                    }, function(){

                        // Rating complete
                        var $raty_container = $('.ui-page-active').find('.trend_rating');
                        var $raty           = $raty_container.find('.raty')

                        var score           = $raty.attr('data-score') !== 'NaN' ? $raty.attr('data-score') : 0;
                        var votes           = $raty.attr('data-votes');

                        var new_votes       = parseInt(votes) + 1;
                        var new_score       = ( score * votes + num ) / new_votes;

                        $raty // Update score and make readonly
                            .raty('score', new_score)
                            .raty('readOnly', true);

                        $raty_container.find('label').find('i').text(new_votes); // Change the number of votes dynamically
                        $raty_container.find('.message').addClass('show'); // Show message

                    });
                }
            });
        }

        function setup_single_trend_gallery(){

            $('.trend_single').find('.image_container').children('div').not(':first-child').click(function(){

                var $el1    = $(this);
                var $el2    = $(this).parents('.image_container').children('div:first-child');

                var $img1       = $el1.children('img');
                var $img2       = $el2.children('img');

                var src1    = $img1.attr('src');
                var src2    = $img2.attr('src');

                $img1.attr('src', src2);
                $img2.attr('src', src1);

            });

        }

    // ----------------------------------

    single_trend_loaded = 1;

}

function setup_explore(){

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
            setup_single_trend_click();
        }
    });

    $('#explore').removeAttr('style');

//    $('#image_list').find('.scrollableArea').children('div').height('');

}

function single_trend_viewed(){ // initiated twice!!
console.log('single_trend');
    if(first_load == 3){
        first_load = 2;
    }
    else if(!first_load || first_load == 2){
        first_load = 1;
    }
console.log('a: '+first_load);
    if(first_load == 1){
        console.log('update');
        var trend_id = location.hash.split('#trend_')[1].split('_')[0];
        $.post('../php/add_trend_view_count.php', {
            trend_id: trend_id
        });
        first_load = 3;
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

    var date = date_3+'-'+date_2+'-'+date_1;

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

            $('#edit_password_old') .val('').keyup();
            $('#edit_password')     .val('').keyup();
            $('#edit_conf_password').val('').keyup();

            // --

            $.mobile.changePage('#create', 'pop');

            // If new profile image
            if(data.hasOwnProperty('profile_image')){
                $('#account_profile').attr('src', data.profile_image);
            }

            // If new password
            if(data.hasOwnProperty('password')){
                $.cookie('password_cookie', data.password)
            }

        },
        dataType: 'json'
    });

}

function setup_account_edit_page(){

    var info = stored_data.user_info;

    $('#edit_username')     .val(info.username).addClass('tick');
    $('#edit_first_name')   .val(info.first_name).addClass('tick');
    $('#edit_last_name')    .val(info.last_name).addClass('tick');
    $('#edit_gender')       .val(info.gender).parent().removeClass('cross').addClass('tick').children('span').text(info.gender.charAt(0).toUpperCase() + info.gender.slice(1));

    $('#edit_email')        .val(info.email).addClass('tick');
    $('#edit_city')         .val(info.city).addClass('tick');
    $('#edit_country')      .val(info.country).addClass('tick');

    $('#edit_date_of_birth_1').val(info.date_of_birth.split('-')[2]).addClass('tick');
    $('#edit_date_of_birth_2').val(info.date_of_birth.split('-')[1]).addClass('tick');
    $('#edit_date_of_birth_3').val(info.date_of_birth.split('-')[0]).addClass('tick');

    $('#edit_password_old').attr('data-pass', info.password);

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
console.log('setting up logged in stuff');
    load_logged_in_ajax(new_login);
    setup_account_stuff();

}

function setup_account_stuff(){

    // Setup username (settings panel)
        $('#account_username').text(stored_data.user_info.username);

    // Setup profile picture (settings panel)
        var img_src = '/images/'+stored_data.user_info.profile_image;
        if(UrlExists(img_src)){
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

    var description = trend.description .replace('<p>','');
    description     = description       .replace('</p>','');

    // Sets up title & description
    $('#edit_trend_title')         .val(trend.title).removeClass('cross').addClass('tick');
    $('#edit_trend_description')   .val(description).removeClass('cross').addClass('tick');

    // Sets tags
    var tags = trend.tags.split(',');
    for(var i=0; i<tags.length; i++){
        var tag = decodeURIComponent(tags[i]);
        $('#edit_trend_tagger').addTag(tag);
    }
    $('#edit_trend_tagger_tagsinput').removeClass('cross').addClass('tick')

    // Sets categories
    var categories = trend.categories.split(',');
    for(var i=0; i<categories.length; i++){
        var category = decodeURIComponent(categories[i]);
        $('#edit_trend_categories').find('div:contains('+category+')').addClass('selected');
    }

    // Sets location
    $('#edit_trend_location').val(trend.location).removeClass('cross').addClass('tick').keyup(); // Calls keyup to enable the SUBMIT button

    // Sets trend_id
    $('#edit_trend_id').val(trend.id);

    $.mobile.changePage('#edit_trend', 'pop');

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

        check_login(); // Does the AJAX for a logged in account

        $.mobile.changePage('#create', 'pop');

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

            setup_logged_in_stuff(1); // Continues onward (the 1 is to tell the script that it's a new login (don't start "load_rest()"))

            $.mobile.changePage('#create', 'pop');

        }
        else { // bad

            $('#login_with_account').find('.message').addClass('show');

        }

    }, 'JSON');

}

function check_if_allowed_page(){

    var allowed_page = '';

    if(
        !location.hash                              || // Home page
        $.cookie('view_type')    == 'explore'            || // Trend page
        location.hash       == '#explore'           || // Explore page
        location.hash       == '#login_with_account'|| // Login page
        location.hash       == '#register_1'        || // Register page
        location.hash       == '#register_2'        || // Register page
        location.hash       == '#register_3'           // Register page
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

    $('#new_trend_title')       .val('').removeClass('tick').addClass('cross');
    $('#new_trend_description') .val('').removeClass('tick').addClass('cross');
    $('#new_trend_location')    .val('').removeClass('tick').addClass('cross');

    $('#new_trend_categories')  .find('div').removeClass('selected');
    $('#new_trend_tagger')      .importTags('');

}


function reset_edit_trend_form(){

    $('#edit_trend_title')      .val('').removeClass('tick').addClass('cross');
    $('#edit_trend_description').val('').removeClass('tick').addClass('cross');
    $('#edit_trend_location')   .val('').removeClass('tick').addClass('cross');

    $('#edit_trend_categories') .find('div').removeClass('selected');
    $('#edit_trend_tagger')     .importTags('');

}

function go_home(on_back){

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

    var $container = $('#research_projects').find('.research_projects');

    if(stored_data.user_info.project_ids){

        $.post('../php/get_logged_in_info.php', {
            project_ids: stored_data.user_info.project_ids
        },function(data){

            $.extend(stored_data, data);

            var projects = stored_data.research_projects; // Updates the stored data with "research_projects"

            var project_pages = '';

            // Loop per research project
            for(var i=0; i<projects.length; i++){

                var project = projects[i];

                project.link_title = 'view_project?id=' + project.id + '&name=' + project.name.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');

                $container.append(
                    '<a href="#'+ project.link_title +'"  data-transition="slide" class="tag">' +
                        '<span>'+ (i+1) +'.</span> '+ project.name +
                    '</a>'
                );

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

function global_page_functions(){

    disable_given_links();

    // If logged in, there is never a need for the slideshow
    if(!logged_in){
        setup_slideshow();
    }
    else {
        setup_slideshow(1); // 1 removes the slideshow as a whole
    }

    // HOME
    if(!location.hash) {

        if(logged_in) {  // If logged in, then forwards the user to the CREATE page
            jQuery.mobile.changePage( $('#create'), true );
            global_page_functions(); // Calls this to start the "not home page" changes after the page has automatically been forwared

            return;
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
                $
                    .cookie('view_type', 'create');

                $('#new_icon').addClass('show'); // Show "new_trend_button"

            }
            if(location.hash == '#explore'){ // Changes the cookie to "explore"

                $.cookie('view_type', 'explore');

            }
            $footer.removeClass('hide');
        }

        check_if_allowed_page(); // Checks if this is an allowed page for NOT logged in users

        if_single_trend_page(); // If opened website on trend, redirect to EXPLORE

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

    type == 'hide' ? $('#page_loading').fadeOut(200) : $('#page_loading').fadeIn(200);

}

function submit_trend(){

    // Title
        var title       = $('#new_trend_title')         .val();
        var description = tinyMCE.activeEditor          .getContent();
        var video       = $('#new_trend_video')         .val();
        var website     = $('#new_trend_website')       .val();
        var location    = $('#new_trend_location')      .val();

        var tags        = get_tags('#new_trend_tagger_tagsinput');
        var categories  = get_categories('#new_trend_categories');
        var ment_trend = $('#new_trend_ment_trends')   .val();

    // Location

    var uploaded_images = $('#uploaded_images_field').val();

    // Submit info
        $.post('../php/submit_trend.php', {
            user_id         : stored_data.user_info.id,
            uploaded_images : uploaded_images,

            title           : title,
            description     : description,
            video           : video,
            website         : website,
            location        : location,

            tags            : tags,
            categories      : categories,
            ment_trend     : ment_trend
        },function(data){
            // Insert HTML

            stored_data.trends.push(data.trend);

            setup_single_trend(data.trend.id);

            $.mobile.changePage('#view_trend', 'pop');

            $.cookie('view_type', 'explore'); // Makes sure that the back button will take the user to the explore page by changing the cookie

            // The back button will take the user HOME
            go_home(1);

            // Reset new trend form (in case the user wants to add another new trend)
            reset_new_trend_form(); // todo continue here

        }, 'JSON');

}

// --- Get stuff ---
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
        $('#reg_email')     .hasClass('tick') &&
        $('#reg_city')      .hasClass('tick') &&
        $('#reg_country')   .hasClass('tick')
    ){
        enable_link('#register_3_button');
    }
    else {
        disable_link('#register_3_button');
    }

    if(
        $('#reg_date_of_birth_1')       .hasClass('tick') &&
        $('#reg_date_of_birth_2')       .hasClass('tick') &&
        $('#reg_date_of_birth_3')       .hasClass('tick')
    ){
        enable_link('#submit_registration_button');
    }
    else {
        disable_link('#submit_registration_button');
    }

    if(
        $('#new_trend_title')           .hasClass('tick') &&
        tinyMCE.activeEditor.getContent()                 &&
        $('#new_trend_video')           .hasClass('tick') &&
        $('#new_trend_website')         .hasClass('tick') &&
        $('#new_trend_location')        .hasClass('tick')
    ){
        enable_link('#new_trend_3_button');
    }
    else {
        disable_link('#new_trend_3_button');
    }

    if(
        $('#new_trend_tagger_tagsinput')                .hasClass('tick')         &&
        $('#new_trend_categories')                      .find('.selected').length &&
        $('#new_trend_ment_trends').parents('.select')  .hasClass('tick')
    ){
        enable_link('#submit_new_trend');
    }
    else {
        disable_link('#submit_new_trend');
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
        $('#edit_trend_title')           .hasClass('tick') &&
        $('#edit_trend_description')     .hasClass('tick') &&
        $('#edit_trend_tagger_tagsinput').hasClass('tick') &&
        $('#edit_trend_location')        .hasClass('tick')
    ){
        enable_link('#submit_edit_trend');
    }
    else {
        disable_link('#submit_edit_trend');
    }

    if(
        $('#edit_first_name')       .hasClass('tick') &&
        $('#edit_last_name')        .hasClass('tick') &&
        $('#edit_gender').parent()  .hasClass('tick') &&

        $('#edit_email')            .hasClass('tick') &&
        $('#edit_city')             .hasClass('tick') &&
        $('#edit_country')          .hasClass('tick') &&

        $('#edit_date_of_birth_1')  .hasClass('tick') &&
        $('#edit_date_of_birth_2')  .hasClass('tick') &&
        $('#edit_date_of_birth_3')  .hasClass('tick')
    ){
        if(
            (
                $('#edit_password_old') .hasClass('cross') &&
                $('#edit_password')     .hasClass('cross') &&
                $('#edit_conf_password').hasClass('cross')
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
        if(!single_trend_loaded){
            $.mobile.changePage('#explore', 'pop');
        }
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
//
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