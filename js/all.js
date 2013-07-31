// ----- Primary setup -----
    $(function(){

        // Definitions
        setup_definitions();

        // Setup critical plugins
        setup_critical_plugins();

        // Does an ajax call to get important information e.g. if logged in, content etc
        load_ajax();

        // Gets the location (not critical, but needs time to get the location)
        get_location();

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

    logged_in   = '';
    $header     = $('#main_header');
    $footer     = $('#main_footer');

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

                    enable_link('#new_trend_2_button');

                }
            });
            this.on('reset', function(){
                disable_link('#new_trend_2_button');
                total_files = 0,
                    complete_files = 0;
            });
        }
    };

}

function load_ajax(){

    // Login stuff
    if(typeof($.cookie('username')) !== 'undefined' && typeof($.cookie('password')) !== 'undefined'){
        var username = $.cookie('username');
        var password = $.cookie('password');
    }
    else {
        var username = '';
        var password = '';
    }

    $.post('php/get_info.php', { username: username, password: password }, function(data){

        // Store the data in a constant
            stored_data = data;

        var projects    = data.research_projects;
        var categories  = data.categories;
        var trends      = data.trends;
        var rater       = data.rater;


        logged_in       = data.user_info ? 1 : 0;

        user_info = data.user_info ? data.user_info : []; // User info from the DB of the logged in user

        // -- Categories --
            var $container = $('#trend_categories');

            for(var i=0; i<categories.length; i++){

                var category = categories[i];
                $container.append(
                    '<div>' +
                        category.name +
                    '</div>'
                );

            }

        // -- Trends --
            var num = trends.length;

            var trend_list      = '';
            var trends_single   = '';

            for(var i=0; i<num; i++){

                var trend = trends[i]; // JSON of trend

                trend.link_title    = 'trend_' + trend.id + '_' + trend.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');

                // Fills up EXPLORE page (trend list)
                trend_list +=
                    '<div>' +
                        '<div class="image_container">' +
                            '<a href="#'+ trend.link_title +'" data-transition="slide">View trend</a>' +
                            '<img src="/images/'+ trend.images.split(',')[0] +'" alt="trend pic" />' +
                        '</div>' +
                        '<section>' +
                            '<header><h1><i>'+ (i+1) +'</i>. '+ trend.title +'</h1></header>' +
                            truncate(trend.description, 400, 1) +
                        '</section>' +
                    '</div>';

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
                var rating = $.grep(rater, function(e){
                    return e.trend_id == trend.id;
                });
                if(!rating.length) {
                    rating = [];
                }
                else {
                    rating = rating[0];
                }
                if(!rating.value) rating.value = 0;
                if(!rating.votes) rating.votes = 0;

                trends_single +=
                    '<div data-role="page" id="'+ trend.link_title +'" data-title="'+ trend.title +'">' +

                        '<div data-role="content">' +
                            '<div class="maxi_container trend_single">' +

                            '<div>' +
                                '<div class="image_container">' + trend_images + '</div>' +

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
                        '</div>' +

                    '</div>';


            }

        // -- Research projects --
            $container = $('#research_projects').find('.research_projects');
            var project_pages = '';

            // Loop per research project
            for(var i=0; i<projects.length; i++){

                var project = projects[i];

                project.link_title = 'project_' + project.id + '_' + project.name.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');

                $container.append(
                    '<a href="#'+ project.link_title +'" class="tag">' +
                        '<span>'+ (i+1) +'.</span> '+ project.name +
                    '</a>'
                );


                var project_trends = $.grep(trends, function(e){
                    return e.research_project == project.id;
                });

                var trend_html = '';

                // Loop per trend in research project
                for(var b=0; b<project_trends.length; b++) {

                    var project_trend = project_trends[b];

                    trend_html +=
                        '<div data-id="'+ project_trend.id +'">' +
                            '<a href="#'+ project_trend.link_title +'">' +
                                '<img src="/images/'+ project_trend.images.split(',')[0] +'" alt="research project image">' +
                                '<span>'+ truncate(project_trend.title, 30) + '</span>' +
                            '</a>' +
                            add_extra_html() +
                        '</div>';

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

                project_pages +=
                    '<div data-role="page" id="'+ project.link_title +'" data-title="'+ project.name +'">' +

                        '<div data-role="content">' +
                            '<div class="maxi_container research_trends">' +
                                trend_html +
                            '</div>' +
                        '</div>' +

                    '</div>'

        }

        $('#image_list')    .append(trend_list);
        $('body')           .append(trends_single)
                            .append(project_pages);

        load_rest();


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
//                console.log(results);
                var city    = results[1]['address_components'][3]['long_name'];
                var country = results[1]['address_components'][4]['long_name'];

                $('.trend_location').val(city+', '+country).removeClass('cross').addClass('tick'); // Adds the gotten city to the .trend_location

            });

        });

    }

}

// ------------------------------ Secondary setup ------------------------------


function on_page_change() {

    global_page_functions();

    // Runs on page change
    $(document).delegate('.ui-page', 'pagebeforeshow', function () {
        console.log('changed');
        global_page_functions();
    });

}

function global_click_functions() {

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

    // On tag click
    $('.tags').find('div').click(function(){

        $(this).hasClass('selected') ? $(this).removeClass('selected') : $(this).addClass('selected');

    });

    // On new trend submit
    $('#submit_new_trend').click(function(){

        submit_new_trend();

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

        var username = $('#login_username').val();
        var password = $('#login_password').val();

        $.post('../php/check_login.php', {
            username   : username,
            password: password
        },function(data){

            if(data){ // good

                $.cookie('username', username);
                $.cookie('password', data);

                $.mobile.changePage('#create', 'pop');

            }
            else { // bad

                $('#login_with_account').find('.message').addClass('show');

            }

        })

    });

    // Workspace stuff
    $('.research_trends').find('a:contains(Edit)').click(function(){

        var $clicked_trend = $('.research_trends').find('a:contains(Edit)').parent('div').parent('div');
        var id = $clicked_trend.attr('data-id');

        var trends = stored_data.trends; // gotten from database

        var trend = $.grep(trends, function(e){
            return e.id == id;
        });
        trend = trend[0];

        var description = trend.description .replace('<p>','');
            description = description       .replace('</p>','');

        // Sets up title & description
            $('#edit_trend_title')         .val(trend.title);
            $('#edit_trend_description')   .val(description);

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
                $('#trend_categories').find('div:contains('+category+')').addClass('selected');
            }

        $.mobile.changePage('#edit_trend', 'pop');

    });

    $('#submit_edit_trend').click(function(){

        if($(this).attr('data-role') == 'disabled') return;

        var title       = $('#edit_trend_title')        .val();
        var description = $('#edit_trend_description')  .val();
        var categories  = get_categories('#edit_trend_categories');

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

    // Rating plugin
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

            if(user_ids.indexOf(user_info.id) != -1) { // Check if the currently logged in user id is contained in the "rated" people section
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
            var trend_id = location.hash.split('#trend_')[1].split('_')[0];
            $.post('../php/submit_rating.php', {
                trend_id    : trend_id,
                user_id     : user_info.id,
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

    // Explore plugin
    setup_smooth_scroll_plugin();

    // Comment plugin
    $('.trend_comments').comments({
        author: {
            id:             user_info.id, // Gotten from global object of "user_info", created when logged in
            username:       user_info.username,
            image:          user_info.profile_image
        },
        onsubmit: function (){
//                alert('comment posted');
        }
    });

    ///////////////////


    function setup_smooth_scroll_plugin(){

        $('#explore').css({ // This one and the one below are necessary to le the plugin init normally whilst the element is invisible
            display: 'block',
            visibility: 'hidden'
        });

        // Smooth div scrolling (for the explore list)
        $("#image_list").smoothDivScroll({
            mousewheelScrolling: "allDirections",
            manualContinuousScrolling: true,
            hotSpotScrollingStep: 10
        });

        $('#explore').removeAttr('style');

//    $('#image_list').find('.scrollableArea').children('div').height('');

    }

    ///////////////////

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
    $('input#conf_password').keyup(function(){

        var val_pass = $('input#password').val();
        var val_conf = $(this).val();

        if(val_conf == val_pass){
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

// ---------------- Other functions (called by other plugins) -----------------

function global_page_functions(){

    disable_given_links();

    // Different layouts (home | not home)
    // Hash tags don't exist, so HOME
    if(!location.hash) {

        if(logged_in) {  // If logged in, then forwards the user to the CREATE page
            jQuery.mobile.changePage( $('#create'), true );
            global_page_functions(); // Calls this to start the "not home page" changes after the page has automatically been forwared

            return;
        }

        setup_slideshow();

        $header.addClass('home');
        $footer.addClass('home').find('.selected').removeClass('selected');

        $footer.find('#create_button').click(function(){

            if($footer.hasClass('home')){ // Only work if on HOME page

                $footer.hasClass('reveal') ? $footer.removeClass('reveal') : $footer.addClass('reveal');

                return false; // Don't let the link take the user the the actual page

            }

        });

    }

    // Not home page
    else {

        if(location.hash !== '#create' && location.hash !== '#explore'){
            $footer.addClass('hide');
            $('#new_icon').removeClass('show'); // Hide "new_trend_button"

            if_single_trend_page(); // Does stuff if trend page

        }
        else {
            if(location.hash == '#create'){ // Changes the cookie to "create"
                $.cookie('view', 'create');

                $('#new_icon').addClass('show'); // Show "new_trend_button"

            }
            if(location.hash == '#explore'){ // Changes the cookie to "explore"
                $.cookie('view', 'explore');
            }
            $footer.removeClass('hide');
        }

        // Change header
        $header.removeAttr('class').addClass($.cookie('view'));

        // Move footer back down to be "normal"
        $footer.removeClass('reveal home');

        var view = $.cookie('view'); // Gets either "create" or "explore"

        $footer.find('.selected').removeClass('selected'); // Remove class
        $footer.find('#'+view+'_button').addClass('selected'); // Add class

    }

    // Back button or menu button (top-left)
    // Menu button
    if(location.hash == '#create' || location.hash == '#explore'){

        // Back button hide
        $('#menu_icon').show(0);
        $('#back_icon_create').removeClass('active');
        $('#back_icon_explore').removeClass('active');

        // Logo show, title hide
        $('#header_logo').show(0);
        $('#header_title').hide(0);

    }

    // Back button
    else if(location.hash){

        // Back button show
        $('#menu_icon').hide(0);

        if(view == 'create'){ // CREATE
            $('#back_icon_create')    .addClass('active');
            $('#back_icon_explore')   .removeClass('active');
        }
        else { // EXPLORE - Single trend page
            $('#back_icon_create')    .removeClass('active');
            $('#back_icon_explore')   .addClass('active');
        }

        // Logo hide, title show
        $('#header_logo').hide(0);
        $('#header_title').show(0).text('');

    }

    // Always change the #header_title accordingly
    $('#header_title').text(document.title)

}

function loader(type){

    type == 'hide' ? $('#page_loading').fadeOut(200) : $('#page_loading').fadeIn(200);

}

function submit_new_trend(){

    if($(this).hasClass('disabled')) return;

    // Title
        var title       = $('#new_trend_title').val();
        var description = $('#new_trend_description').val();
        var tags        = get_tags('#new_trend_tagger_tagsinput');
        var categories  = get_categories('#trend_categories');


    // Location
        var location = $('.trend_location').val();

    var uploaded_images = $('#uploaded_images_field').val();

    // Submit info
        $.post('../php/submit_new_trend.php', {
            uploaded_images : uploaded_images,
            title           : title,
            description     : description,
            tags            : tags,
            categories      : categories,
            location        : location
        },function(data){

            if(data){
                console.log(data);
            }

            $.mobile.changePage('#new_trend_finished_submit', 'pop');

        });

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
        $('#reg_first_name').hasClass('tick') &&
        $('#reg_last_name') .hasClass('tick') &&
        $('#reg_username')  .hasClass('tick')
    ){
        enable_link('#register_2_button');
    }
    else {
        disable_link('#register_2_button');
    }

    if(
        $('#reg_date_of_birth')             .hasClass('tick') &&
        $('#reg_gender').parent('.select')  .hasClass('tick') &&
        $('#reg_password')                  .hasClass('tick') &&
        $('#reg_conf_password')             .hasClass('tick')
    ){
        enable_link('#register_3_button');
    }
    else {
        disable_link('#register_3_button');
    }

    if(
        $('#reg_email')     .hasClass('tick') &&
        $('#reg_city')      .hasClass('tick') &&
        $('#reg_country')   .hasClass('tick')
    ){
        enable_link('#finish_registration_button');
    }
    else {
        disable_link('#finish_registration_button');
    }

    if(
        $('#new_trend_description')      .hasClass('tick') &&
        $('#new_trend_tagger_tagsinput') .hasClass('tick') &&
        $('.trend_location')            .hasClass('tick')
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

    // --------------

}

function if_single_trend_page(){

    // Trend page
    if($.cookie('view') == 'explore' && location.hash !== '#login_with_account'){
        get_trend_comments();
    }

}

function get_trend_comments() {

    var page_id = '#'+ $.mobile.activePage.attr('id');

    var $trend_comments = $(page_id).find('.trend_comments');

    $trend_comments.comments({
        get_comments: true,
        author: {
            id: user_info.id
        }
    });

}

function setup_slideshow() {

    var $img = $('#home_image').children('img').eq(0); // first image
    var timeout = 5000;

    setInterval(function(){

        if($img.next().length){ // if we can get the NEXT image
            var $next = $img.next();
        }
        else { // otherwise use the first again
            var $next = $img.prevAll().last(); // gets the first
        }

        $img.fadeOut(400);
        $next.fadeIn(400);

        $img = $next;

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
        var orig_img_height = $img.height();
        var orig_img_width  = $img.width();

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

        var img_left   = ( img_width - window_width ) / 2;

        $img.height(img_height)
            .width(img_width)
            .css({
                maxWidth: 'none',
                left: -img_left
            });

    }

}

// -------- Collection of different functions ---------

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
};

// ---------------------------------------------------