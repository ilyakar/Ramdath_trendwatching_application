// ----- Primary setup -----
$(function(){

    // Definitions
    setup_definitions();

    // Check if internet connection dead
    var dead_internet = check_internet_connection();
    if(dead_internet) return;

    // Setup critical plugins
    setup_critical_plugins();

    check_login(); // -> then calls load_rest();

});

// ----- Secondary setup -----
function load_rest(){

    // Init global_page_functions on start AND page change
    on_page_change();

    // Global click functions
    global_click_functions();

    // Plugin setup
    setup_other_plugins('all');

    // Form stuff
    form_stuff();

    // Show app
    loader('hide');

}

// ------------------------------ Primary setup ------------------------------

function setup_definitions(){

    logged_in                       = '';
    not_first_page_load                 = '';

    $header                         = $('#main_header');

    stored_data                     = [];
    stored_data.categories          = [];
    stored_data.trends              = [];
    stored_data.rater               = [];
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


    tinymce.init({
        selector: "textarea#new_trend_description, textarea#edit_trend_description",
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

function check_login(new_login){

    var username    = $.cookie('admin_username_cookie');
    var password    = $.cookie('admin_password_cookie');

    if(username && password){
        $.post('/php/check_login.php', {
            username    : username,
            password    : password
        }, function(data){
console.log(data);
            if(data.user_info){
console.log('logged in');
                $.extend(stored_data, data);

                logged_in = 1;

                load_ajax(); // Calls load_rest after
                setup_account_stuff();

            }
            else {
                console.log('not logged in');
                $.removeCookie('admin_username_cookie');
                $.removeCookie('admin_password_cookie');

                load_rest();
            }

            if(new_login){
                if(logged_in){
                    $.mobile.changePage('#manage_trends', 'pop');
                }
                else {
                    $('#login_with_account').find('.message').addClass('show');
                }
            }

        }, 'JSON');

    }
    else {
        load_rest();
    }

}

// ------------------------------ Secondary setup ------------------------------

function on_page_change(){

    global_page_functions(1);

    // Runs on page change
    $(document).delegate('.ui-page', 'pagebeforeshow', function () {
        global_page_functions();
    });

}

function global_click_functions(){

    $('#workspace_container').find('a').click(function(){

        view_workspace(this);

    });

    $('#submit_info_edit').click(function(){

        if($(this).attr('data-role') == 'disable') return;

        submit_edit_info();

    });

    $('#submit_edit_trend').click(function(){

        if($(this).attr('data-role') == 'disable') return;

        submit_edit_trend();

    });

    $('body').on('click', '#manage_trends a:contains(Edit)', function(){

        setup_edit_trend(this);

    });

    $('body').on('click', '#manage_trends a:contains(Delete)', function(){

        delete_trend(this);

    });

    // Account edit
    $('body').on('click', '#manage_accounts div.extra a:contains(Edit)', function(){

        setup_account_edit(this);

    });

    // Account delete
    $('body').on('click', '#manage_accounts div.extra a:contains(Delete)', function(){

        delete_account(this);

    });

    // On trend view button click
    $('body').on('click', 'a.trend_link', function(data){

        var hash = data.currentTarget.hash;
        var id = $.textParam('id', hash);
        setup_single_trend(id);

    });

    $('#submit_account_edit_button').click(function(){

        if($(this).attr('data-role') == 'disable') return false;

        submit_account_edit();

    });

    // Trend view
    $('#view_select').children('a').click(function(){

        if($(this).hasClass('active') && $(this).text() == 'All trends') return false;

        click_view_button(this);

    });

    // Filter by
    $('#filter_by_select').find('li').children('a').click(function(){

        click_filter_by_button(this);

    });

    // Logout
    $('#logout_button').click(function(){

        account_logout();

    });

    // Login
    $('#submit_login').click(function(){

        if($(this).attr('data-role') == 'disable') return;

        submit_login();

    });

    // Settings panel
    $('body').on('click', '#menu_icon', function(){

        menu_icon_click();

    });

}

function setup_other_plugins(type){

    // Fancybox
    if(type == 'all'){
        $('.fancybox').fancybox();
    }

    // Tag plugin
    if(type == 'all'){
        $('#edit_trend_tagger').tagsInput({
            height: '100%',
            width: '100%',
            onChange: function(){

                var $input = $('#new_trend_tagger_tagsinput');

                if($input.children('span').length)  $input.removeClass('cross').addClass('tick');
                else                                $input.removeClass('tick').addClass('cross');

                setup_form_buttons();

            }
        });
    }

    // Filter by
    if(type == 'all'){
        $('#view_buttons').dropdown();
    }

    // Trend masonry
    if(type == 'masonry_trend'){

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
                    columnWidth: 75.5,
                    isFitWidth: false
                });

                loaded = 1;

            }
        }
    }

}

function form_stuff(refresh){

    // Adds the .cross class to all input fields
    var $inputs = $('input[type="text"], input[type="password"], textarea, .tagsinput');
    for(var i=0; i<$inputs.length; i++){

        var $input = $inputs.eq(i);
        $input.val() || $input.children('span.tag').length ? $input.removeClass('cross').addClass('tick') : $input.removeClass('tick').addClass('cross');

    }

    if(refresh) return;

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

    // On tag click
    $('.tags').find('div').click(function(){

        $(this).hasClass('selected') ? $(this).removeClass('selected') : $(this).addClass('selected');

        setup_form_buttons();

    });

}

// ---------------- Other functions (called by other functions) -----------------

function if_not_home_page(){

    if(location.hash && location.hash !== '#manage_trends' && location.hash !== '#manage_accounts' && location.hash !== '#manage_info'){

        return true;

    }
    else {

        return false;

    }

}

function setup_workspaces(){

    var workspaces = stored_data.research_projects;
    var $container = $('#edit_account_workspaces');

    if($container.html()) return; // Cancels if not setting up for the first time

    for(var i=0; i<workspaces.length; i++){

        var workspace = workspaces[i];

        $container.append(
            '<div data-id="'+ workspace.id +'">' + workspace.name + '</div>'
        );

    }

}

function setup_privilages(){

    var privilages = stored_data.privilages;
    var $container = $('#edit_account_privilage');

    for(var i=0; i<privilages.length; i++){

        var privilage = privilages[i];
        $container.append('<option value="'+ privilage.letter +'">'+ privilage.name +'</option>');

    }

}

function if_settings_panel_page(){

    $('#settings_panel').find('a.selected').removeClass('selected');

    var $potential_link = $('#settings_panel').find('a[href="'+ location.hash +'"]');

    if($potential_link.length){

        $potential_link.addClass('selected');

    }

}

function view_workspace(that){

    var id      = $(that).attr('data-id');
    var title   = $(that).html().split('</span> ')[1];

    $('#trend_container')       .fadeIn(200);
    $('#workspace_container')   .fadeOut(200);

    $('#filter_by_select')      .fadeIn(200);

    $('#trend_container_workspace').children('b').text(title);
    $('#view_select').children().removeClass('active');

    var el_array = [];
    var $els = $('#trend_container').find('[data-workspace]:not([data-workspace="'+ id +'"])');

    for(var i=0; i<$els.length; i++){
        var $el = $els.eq(i);
        el_array.push($el);
    }

    $('#trend_container')
        .masonry('hide', el_array)
        .masonry('layout');

    $('#view_select').find('a:contains(All trends)').click(function(){

        $els.show(0);
        $('#trend_container').masonry('layout');


    });

}

function site_message(text){

    var $container = $('#site_message');

    $container.text(text).addClass('show')

    setTimeout(function(){

        $container.removeClass('show')

    }, 5000);

}

function submit_edit_info(){

    var workspaces  = $('#edit_info_workspaces')    .val();
    var categories  = $('#edit_info_categories')    .val();
    var ment_trends = $('#edit_info_ment_trends')   .val();

    workspaces = workspaces.replace(/\n/g, ',');
    workspaces = trim_whitespace(workspaces);

    categories = categories.replace(/\n/g, ',');
    categories = trim_whitespace(categories);

    ment_trends = ment_trends.replace(/\n/g, ',');
    ment_trends = trim_whitespace(ment_trends);

    $.post('php/update_info.php', {

        workspaces  : workspaces,
        categories  : categories,
        ment_trends : ment_trends

    }, function(data){
        console.log(data);
        site_message('You have updated some site extra info');

    });

}

function setup_edit_info(){

    var workspaces  = stored_data.research_projects;
    var categories  = stored_data.categories;
    var ment_trends = stored_data.mentality_trends;

    // Setup categories
    var workspace_html = '';
    for(var i=0; i<workspaces.length; i++){

        var workspace = workspaces[i].name;

        workspace_html += workspace +'\n';

    }
    workspace_html = workspace_html.substring(0, workspace_html.length - 1);

    // Setup categories
    var category_html = '';
    for(var i=0; i<categories.length; i++){

        var category = categories[i].name;

        category_html += category +'\n';

    }
    category_html = category_html.substring(0, category_html.length - 1);

    // Setup mentality trends
    var ment_trend_html = '';
    for(var i=0; i<ment_trends.length; i++){

        var ment_trend = ment_trends[i].name;

        ment_trend_html += ment_trend +'\n';

    }
    ment_trend_html = ment_trend_html.substring(0, ment_trend_html.length - 1);

    $('#edit_info_workspaces')  .val(workspace_html);
    $('#edit_info_categories')  .val(category_html);
    $('#edit_info_ment_trends') .val(ment_trend_html);

    form_stuff(1);

}

function delete_trend(that){

    var $item = $(that).parents('[data-id]');
    var id = $item.attr('data-id');

    if(confirm('Are you sure you want to remove this trend?')){
        $.post('/php/delete_trend.php', {
            trend_id: id
        });

        $item.fadeOut(200);

        setTimeout(function(){
            $('#trend_container').masonry('layout');
        }, 300);
    }

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

function get_categories(container, id) {

    var categories = '';
    var $categories = $.mobile.activePage.find(container).children('div.selected');
    var num = $categories.length;

    for(var i=0; i<num; i++){

        var $category = $categories.eq(i);

        if(!id){
            var category = $category.text();
        }
        else {
            var category = $category.attr('data-id');
        }

        category = encodeURIComponent(category);

        categories += category+',';

    }
    categories = categories.substring(0, categories.length - 1);

    return categories;

}

function submit_edit_trend(){

    var trend_id    = $('#edit_trend_id')                       .val();

    var title       = $('#edit_trend_title')                    .val();
    var description = tinyMCE.activeEditor                      .getContent();
    var video       = $('#edit_trend_video')                    .val();
    var website     = $('#edit_trend_website')                  .val();
    var location    = $('#edit_trend_location')                 .val();

    var tags        = get_tags('#edit_trend_tagger_tagsinput');
    var categories  = get_categories('#edit_trend_categories');
    var ment_trend  = $('#edit_trend_ment_trends')              .val();

    // Submit info
    $.post('/php/update_trend.php', {
        trend_id        : trend_id,

        title           : title,
        description     : description,
        video           : video,
        website         : website,
        location        : location,

        tags            : tags,
        categories      : categories,
        ment_trend      : ment_trend
    },function(data){

        load_ajax(); // Reloads all the ajax incl. trends
        $.mobile.changePage('#manage_trends', 'pop');

        site_message('You have edited the trend "'+ title +'"');

    });

}

function setup_mentality_trends(){

    var ment_trends = stored_data.mentality_trends;
    var $container1 = $('#edit_trend_ment_trends');

    for(var i=0; i<ment_trends.length; i++){
        var ment_trend = ment_trends[i];
        $container1.append('<option value="'+ ment_trend.name.toLowerCase() +'">'+ ment_trend.name +'</option>');
    }

}

function setup_edit_trend(that){

    reset_edit_trend_form();

    var id = $(that).parents('div[data-id]').attr('data-id');

    var trends = stored_data.trends; // gotten from database

    var trend = $.grep(trends, function(e){
        return e.id == id;
    });
    trend = trend[0];

    // Sets up title & description
    $('#edit_trend_title')  .val(trend.title);
    tinyMCE.activeEditor    .setContent(trend.description);

    // Sets video and website link
    $('#edit_trend_video')  .val(trend.video);
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
    $('#edit_trend_location').val(trend.location); // Calls keyup to enable the SUBMIT button

    // Sets trend_id
    $('#edit_trend_id').val(trend.id);

    $('#edit_trend_ment_trends').val(trend.ment_trend).change();

    form_stuff(1); // Refreshes form stuff
    setup_form_buttons();

    $.mobile.changePage('#edit_trend_1', 'pop');

}

function reset_edit_trend_form(){

    $('#edit_trend_title')      .val('').removeClass('tick').addClass('cross');
    $('#edit_trend_description').val('').removeClass('tick').addClass('cross');
    $('#edit_trend_location')   .val('').removeClass('tick').addClass('cross');

    $('#edit_trend_categories') .find('div').removeClass('selected');
    $('#edit_trend_tagger')     .importTags('');

}

function delete_account(that){

    var id = $(that).parents('li').attr('data-id');

    if(confirm('Are you sure you want to delete this account?')){
        $.post('php/delete_account.php', {
            account_id: id
        });

        $('#manage_accounts').find('[data-id="'+ id +'"]').fadeOut(200);

    }

}

function submit_account_edit(){

    var account_id  = $('#edit_account_id')         .val();

    var privilage   = $('#edit_account_privilage')  .val();
    var workspaces  = get_categories('#edit_account_workspaces', 1);

    var first_name  = $('#edit_first_name')         .val();
    var last_name   = $('#edit_last_name')          .val();
    var gender      = $('#edit_gender')             .val();

    var email       = $('#edit_email')              .val();
    var city        = $('#edit_city')               .val();
    var country     = $('#edit_country')            .val();

    var date_1      = $('#edit_date_of_birth_1')    .val();
    var date_2      = $('#edit_date_of_birth_2')    .val();
    var date_3      = $('#edit_date_of_birth_3')    .val();

    var date = date_3+'-'+date_2+'-'+date_1;

    var password    = $('#edit_password')           .val();

    // AJAX time
    $('#edit_profile_form').ajaxSubmit({
        url: '/php/edit_account_info.php',
        data: {
            account_id      : account_id,

            privilage       : privilage,
            workspaces      : workspaces,

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
console.log(data);
            // Reset some stuff

            $('#edit_password')     .val('').keyup();
            $('#edit_conf_password').val('').keyup();

            load_ajax(1); // Reloads all the ajax incl. account list

            // --

            $.mobile.changePage('#manage_accounts', 'pop');

            site_message('You have successfully edited '+ first_name +'\'s account information."');

            // If new profile image
            if(data.hasOwnProperty('profile_image')){
                $('#account_profile').attr('src', data.profile_image);
            }

        }
    });

}

function setup_account_edit(that){

    var id = $(that).parents('li').attr('data-id');

    var info = $.grep(stored_data.accounts, function(e){
        return e.id == id;
    });
    info = info[0];

    var img_src = '/images/'+ info.profile_image;
    if(UrlExists(img_src)){
        $('#edit_profile_image_thumbnail').attr('src', img_src);
    }

    $('#edit_account_id')       .val(info.id);

    $('#edit_account_privilage').val(info.privilage).change();

    // Sets workspaces
    var $container = $('#edit_account_workspaces');
    $container.find('.selected').removeClass('selected');

    var workspaces = info.project_ids.split(',');
    for(var i=0; i<workspaces.length; i++){
        var workspace = workspaces[i];
        $container.find('div[data-id='+ workspace +']').addClass('selected');
    }

    $('#edit_username')     .val(info.username);
    $('#edit_first_name')   .val(info.first_name);
    $('#edit_last_name')    .val(info.last_name);
    $('#edit_gender')       .val(info.gender).change();

    $('#edit_email')        .val(info.email);
    $('#edit_city')         .val(info.city);
    $('#edit_country')      .val(info.country);

    $('#edit_date_of_birth_1').val(info.date_of_birth.split('-')[2]);
    $('#edit_date_of_birth_2').val(info.date_of_birth.split('-')[1]);
    $('#edit_date_of_birth_3').val(info.date_of_birth.split('-')[0]);

    form_stuff(1);
    setup_form_buttons();

    $.mobile.changePage('#edit_account', 'pop');

}

function setup_accounts(){

    var accounts    = stored_data.accounts;
    var $container  = $('#account_ul');
    var html        = '';

    for(var i=0; i<accounts.length; i++){

        var account = accounts[i];

        html +=
            '<li data-id="'+ account.id +'">' +
                '<span><b>'+ ( account.username ? account.username : 'N.A.' )  + '</b></span>' +
                '<span>'+ ( account.country ? account.country : 'N.A.' )    + '</span>' +
                '<span>'+ ( account.email ? account.email : 'N.A.' )        + '</span>' +
                add_extra_html() +
            '</li>';

    }

    $container.html(html);

    function add_extra_html(){

        var extra_html =
            '<div class="extra">' +
                '<a href="#" class="button no_image">Edit</a>' +
                '<a href="#" class="button no_image red">Delete</a>' +
            '</div>';

        return extra_html;

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
                embed_video = '<iframe width="100%" height="250" src="//www.youtube.com/embed/'+ video_id+ '" frameborder="0" allowfullscreen></iframe>';
            }
        }
        else if(trend.video.indexOf('vimeo')) {
            console.log('vimeo');
            var video_id = trend.video.split('.com/')[1];
            if(video_id){
                embed_video = '<iframe src="http://player.vimeo.com/video/'+ video_id +'" width="100%" height="250" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
            }
        }
    }

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
            '<div class="video_container">' + embed_video + '</div> ' +
            '</div>' +

            '<div class="span6">' +

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

            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="trend_comments"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

    $('#view_trend').html(trend_single);

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

    // ----------------------------------

    single_trend_loaded = 1;

}

function setup_categories(){

    var categories = stored_data.categories;
    var $container = $('div[data-d-id="category"]');
    var $container2 = $('#edit_trend_categories');

    for(var i=0; i<categories.length; i++){

        var category = categories[i];

        $container.append(
            '<li><a href="#">' +
                category.name +
            '</a></li>'
        );

        $container2.append(
            '<div>' +
                category.name +
            '</div>'
        );

    }

    // Wraps categories in columns
    var categories = $container.children('li');
    var num = categories.length;
    var ceil = Math.ceil(num/3);

    for(var i=0; i<num; i+=ceil){

        categories.slice(i, i+ceil).wrapAll('<ul></ul>');

    }

}

function click_filter_by_button(that){

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
        $('#filter_by_select').children('a[data-d-id="'+ type +'"]').addClass('active');
    }
    else { // Removes .active class from the main button
        $('#filter_by_select').children('a[data-d-id="'+ type +'"]').removeClass('active');
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
            columnWidth: 75.5,
            isFitWidth: false
        });
    }

}

function click_view_button(that){

    var value = $(that).text().toLowerCase();

    if(value == 'all trends'){

        $('#workspace_container')   .fadeOut(200);
        $('#trend_container')       .fadeIn(200);

        $('#filter_by_select')      .fadeIn(200);

        $('#trend_container_workspace').find('b').text('All');

    }

    if(value == 'workspaces'){

        $('#trend_container')       .fadeOut(200);
        $('#workspace_container')   .fadeIn(200);

        $('#filter_by_select')      .fadeOut(200);

        // If we are changing workspaces, refresh the content
        if($('#trend_container_workspace').find('b').text() !== 'All'){
            $('#trend_container').find('[data-workspace]').show(0);
            $('#trend_container').masonry('layout');
        }

    }

    $('#view_select').find('a').removeClass('active');
    $(that).addClass('active');

}

function account_logout(){

    $.removeCookie('admin_username_cookie');
    $.removeCookie('admin_password_cookie');
    window.location = '/iadmin/'; // On logout of facebook go back home

}

function menu_icon_click(){

    // Open panel
    if(!$('body').hasClass('open_panel')){
        $('body').addClass('open_panel');
    }
    else {
        $('body').removeClass('open_panel');
    }

}

function submit_login(){
    $.cookie('admin_username_cookie',     $('#login_username').val() );
    $.cookie('admin_password_cookie', md5($('#login_password').val()));

    check_login(1);
}

function load_ajax(not_first_time){

    $.post('/php/get_info.php', function(data){

        // Store the data in a constant
        $.extend(stored_data, data);

        $.post('php/get_extra_info.php', function(data){

            // Store the data in a constant
            $.extend(stored_data, data);

            add_ajax(not_first_time); // Calls load_rest after

        }, 'JSON');

    }, 'JSON');

}

function add_ajax(not_first_time){

    setup_trend_view();
    setup_workspace_view();
    setup_categories();
    setup_accounts();
    setup_mentality_trends();
    setup_workspaces();
    setup_edit_info();
    setup_privilages();

    if(!not_first_time){
        load_rest();
    }

}

function setup_account_stuff(){

    $('#menu_icon').show(0);

    // Setup username (settings panel)
    $('#account_username').text(stored_data.user_info.username);

    // Setup profile picture (settings panel)
    var img_src = '/images/'+stored_data.user_info.profile_image;
    if(UrlExists(img_src)){
        $('#account_profile').attr('src', img_src);
    }

}

function setup_workspace_view(){

    var workspaces = stored_data.research_projects;

    var $container = $('#workspace_container');
    var html = '';

    // Append workspaces
    for(var i=0; i<workspaces.length; i++){

        var workspace = workspaces[i];

        html +=
            '<a href="#" data-id="'+ workspace.id +'"  data-transition="slide" class="tag">' +
                '<span>'+ (i+1) +'.</span> '+ workspace.name +
            '</a>';

    }

    $container.html(html);

    // Columnise workspaces
    var workspaces = $container.children('a');
    var num = workspaces.length;
    var ceil = Math.ceil(num/2);

    workspaces.wrapAll('<div class="row-fluid"></div>');
    for(var i=0; i<num; i+=ceil){

        workspaces.slice(i, i+ceil).wrapAll('<div class="span6"></div>');

    }

}

function setup_trend_view(){

    var trends = stored_data.trends;

    var trend_html = '';

    // Loop per trend in research project
    for(var i=0; i<trends.length; i++) {

        var trend = trends[i];

        trend.link_title = '/#view_trend?id='+ trend.id +'&title='+ trend.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')

        if(trend.rating.votes){
            var rating = trend.rating.value / trend.rating.votes;
        }
        else {
            var rating = 0;
        }

        trend_html +=
            '<div data-id="'+ trend.id +'" data-categories="'+ trend.categories +'" data-workspace="'+ trend.research_project +'" data-num-comments="'+ trend.num_comments +'" data-rating="'+ rating +'" data-views="'+ (trend.views ? trend.views : 0) +'">' +
                '<a href="'+ trend.link_title +'" class="trend_link">' +
                    '<div class="image_container">' +
                    '   <img src="/images/'+ trend.images.split(',')[0] +'" alt="research project image">' +
                    '</div>' +
                    '<span>'+ truncate(trend.title, 30) + '</span>' +
                '</a>' +
                add_extra_html() +
            '</div>';

    }
    if(!trends.length){

        trend_html += '<div class="message show no_float red">No trends...</div>';

    }

    $('#trend_container').html(trend_html);

    setup_other_plugins('masonry_trend');

    // -----------------------------

    // Adds the delete & remove button
    function add_extra_html() {

        var html =
            '<div class="extra">' +
                '<a href="#" class="button no_image edit">Edit</a>' +
                '<a href="#" class="button red no_image delete">Delete</a>' +
            '</div>';

        return html;

    }
}

function setup_form_buttons(){

    if(
        $('#login_username').hasClass('tick') &&
        $('#login_password').hasClass('tick')
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
        $('#edit_country')          .hasClass('tick') &&

        $('#edit_date_of_birth_1')  .hasClass('tick') &&
        $('#edit_date_of_birth_2')  .hasClass('tick') &&
        $('#edit_date_of_birth_3')  .hasClass('tick')
    ){
        if(
            (
                $('#edit_password')     .hasClass('cross') &&
                $('#edit_conf_password').hasClass('cross')
            ) || (
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

    if(
        $('#edit_trend_title')           .hasClass('tick') &&
        tinyMCE.activeEditor             .getContent()     &&
        $('#edit_trend_video')           .hasClass('tick') &&
        $('#edit_trend_website')         .hasClass('tick') &&
        $('#edit_trend_location')        .hasClass('tick')
    ){
        enable_link('#edit_trend_2_button');
    }
    else {
        disable_link('#edit_trend_2_button');
    }

    if(
        $('#edit_trend_tagger_tagsinput')                .hasClass('tick')         &&
        $('#edit_trend_categories')                      .find('.selected').length &&
        $('#edit_trend_ment_trends').parents('.select')  .hasClass('tick')
    ){
        enable_link('#submit_edit_trend');
    }
    else {
        disable_link('#submit_edit_trend');
    }

    if(
        $('#edit_info_workspaces').hasClass('tick') &&
        $('#edit_info_categories')  .hasClass('tick') &&
        $('#edit_info_ment_trends') .hasClass('tick')
    ){
        enable_link('#submit_info_edit');
    }
    else {
        disable_link('#submit_info_edit');
    }

}

function loader(type){

    type == 'hide' ? $('#page_loading').fadeOut(200) : $('#page_loading').fadeIn(200);

}

function global_page_functions(first_load){

    if(first_load){

        if(if_not_home_page()){

            $.mobile.changePage('#manage_trends', 'pop');

        }

    }

    disable_given_links();

    // /iadmin/
    if(!location.hash){

        if(logged_in){
            $.mobile.changePage('#manage_trends', 'pop');
        }

    }
    else {

        if(!logged_in){
            $.mobile.changePage('/iadmin/', 'pop');
        }

    }

    if(location.hash == '#manage_trends'){

        if(not_first_page_load){

            setTimeout(function(){
                $('#trend_container')
                    .masonry('destroy')
                    .masonry({
                    columnWidth: 75.5,
                    isFitWidth: false
                });
            }, 200);

        }

    }

    if(if_not_home_page()){
        $('#back_icon').show(0);
        $('#menu_icon').hide(0);
    }
    else {
        $('#back_icon').hide(0);
        $('#menu_icon').show(0);
    }

    if(!not_first_page_load) not_first_page_load = 1;

    if($('body').hasClass('open_panel'))$('body').removeClass('open_panel'); // Makes the side panel hide on page change

    if_settings_panel_page(); // Add .selected class if so, if not, remove .selected class

}

// -------- Collection of different functions ---------

function trim_whitespace (s) {
    s = s.replace(/(^\s*)|(\s*$)/gi,"");
    s = s.replace(/[ ]{2,}/gi," ");
    s = s.replace(/\n /,"\n"); return s;
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

    setup_form_buttons();
}

// Used to change the current page variable and to initiate a function
//var set = function(obj, new_value) {
//    obj.value = new_value;
//    /* call whatever your heart desires here */
//}

// If u supply a string and param name, it will give the param value
$.textParam = function(param, string){
    var results = new RegExp('[\\?&]' + param + '=([^&#]*)').exec(string);
    return results[1] || 0;
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