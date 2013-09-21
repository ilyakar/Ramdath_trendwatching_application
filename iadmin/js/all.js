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
function load_rest(new_login){

    // Init global_page_functions on start AND page change
    on_page_change();

    // Global click functions
    global_click_functions();

    // Plugin setup
    setup_other_plugins('all');

    // Form stuff
    form_stuff(new_login);

    // Show app
    show_app();

    finished_loading = 1;

}

// ------------------------------ Primary setup ------------------------------

function setup_definitions(){

    logged_in                       = '';
    not_first_page_load             = '';


    site_message_timeout            = '';
    type_timeout                    = '';

    finished_loading                = '';

    $header                         = $('#main_header');
    $footer                         = $('#main_footer');

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
        selector: "textarea#new_trend_description, textarea#edit_trend_description, textarea#edit_workspace_more_info",
        plugins: [
            "link, code"
        ],

        toolbar1: "bold italic underline strikethrough | link unlink | undo redo | code",

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
            if(data.user_info && ( data.user_info.privilage == 'e' || data.user_info.privilage == 'f' )){
                $.extend(stored_data, data);

                logged_in = 1;

                load_ajax('', new_login); // Calls load_rest after
                setup_account_stuff();

            }
            else {
                $.removeCookie('admin_username_cookie');
                $.removeCookie('admin_password_cookie');

                load_rest();
            }

            if(new_login){
                if(logged_in){
                    $.mobile.changePage('#manage_trends', 'pop');
                }
                else {
                    site_message('Invalid username or password.');
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

    if(finished_loading) return;

    $('body').on('click', '#submit_workspace_settings', function(){

        submit_workspace_settings();

    });

    $('body').on('click', '#workspace_settings_links a', function(){

        workspace_settings_link_click(this);

    });

    $('body').on('keyup', 'fieldset.date_of_birth input', function(){

        check_date_of_birth(this);

    });

    $('body').on('keyup', '#reg_email, #edit_email', function(){

        check_register_email(this);

    });

    $('body').on('click', '#account_search input[type="submit"]', function(){

        var keywords = $(this).parents('form').find('[type="search"]').val();
        setup_accounts(keywords);

    });

    $('body').on('click', '#workspace_container a', function(){

        view_workspace(this);

    });

    $('body').on('click', '#submit_info_edit', function(){

        if($(this).attr('data-role') == 'disable') return;

        submit_edit_info();

    });

    $('body').on('click', '#submit_edit_trend', function(){

        if($(this).attr('data-role') == 'disable') return;

        submit_edit_trend();

    });

    $('body').on('click', '#manage_trends a:contains(Edit)', function(){

        setup_edit_trend(this);

    });

    $('body').on('click', '#manage_trends a:contains(Send to main)', function(){

        if($(this).attr('data-role') == 'disable') return false;

        send_trend(this);

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

        if($(this).hasClass('active') && $(this).text() == 'All signs') return false;

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

                setTimeout(function(){ // SetTimeout fixes a bug...

                    $container.masonry({
                        columnWidth: 75.5
                    });

                }, 200);

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

        if (this.files && this.files[0]) {

            var reader = new FileReader();

            reader.onload = function (e) {
                $('.thumbnail_upload').find('img').attr('src', e.target.result);
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

        var key = event.keyCode || event.which;

        if (key === 13) {

            if($(this).attr('data-form') == 'no-enter') return;

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

}

// ---------------- Other functions (called by other functions) -----------------

function submit_workspace_settings(){

    var workspace_id        = $('#edit_workspace_id').val();
    var more_info_html = tinyMCE.activeEditor.getContent();
    var ment_trends         = $('#edit_workspace_ment_trends').val();

        ment_trends         = ment_trends.replace(/\n/g, '-,-');
        ment_trends         = trim_whitespace(ment_trends);

    $.post('php/update_info.php', {

        workspace_id    : workspace_id,
        more_info_html  : more_info_html,
        ment_trends     : ment_trends

    }, function(data){

        load_ajax(1);
        site_message('You have updated the workspace');
        jQuery.mobile.changePage($('#manage_info'));

    });

}

function workspace_settings_link_click(that){

    var id = $(that).attr('data-id');

    // Get workspace that we just clicked
    var workspace = $.grep(stored_data.research_projects, function(e){
        return e.id == id;
    });
    workspace = workspace[0];

    // Get mentality trends
    var ment_trends = $.grep(stored_data.mentality_trends, function(e){
        return e.workspace_id == id;
    });

    // Setup mentality trends
    var ment_trend_html = '';
    for(var i=0; i<ment_trends.length; i++){

        var ment_trend = ment_trends[i].name;

        ment_trend_html += ment_trend +'\n';

    }
    ment_trend_html = ment_trend_html.substring(0, ment_trend_html.length - 1);

    $('#edit_workspace_id')                 .val(id);
    $('#edit_workspace_ment_trends')        .val(ment_trend_html);

    if(workspace.more_info_html){
        tinyMCE.get('edit_workspace_more_info') .setContent(workspace.more_info_html);
    }

    form_stuff(1);

    jQuery.mobile.changePage($('#workspace_settings'));

}

function setup_countries(){

    var countries = stored_data.countries;

    for(var i=0; i<countries.length; i++){

        var country = countries[i];
        $('#edit_country').append('<option value="'+ country.country +'">'+ country.country +'</option>');

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

        $.post('/php/check_register_info.php', {
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
    var $container2 = $('#edit_trend_workspaces');

    if($container.html()) return; // Cancels if not setting up for the first time

    for(var i=0; i<workspaces.length; i++){

        var workspace = workspaces[i];

        $container.append(
            '<div data-id="'+ workspace.id +'">' + workspace.name + '</div>'
        );

        $container2.append(
            '<option value="'+ workspace.id +'">'+ workspace.name +'</option>'
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

    $('#view_select').find('a:contains(All signs)').click(function(){

        $els.show(0);
        $('#trend_container').masonry('layout');


    });

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

function submit_edit_info(){

    var workspaces  = $('#edit_info_workspaces')    .val();
    var categories  = $('#edit_info_categories')    .val();
    var ment_trends = $('#edit_info_ment_trends')   .val();

    workspaces = workspaces.replace(/\n/g, '-,-');
    workspaces = trim_whitespace(workspaces);

    categories = categories.replace(/\n/g, '-,-');
    categories = trim_whitespace(categories);

    ment_trends = ment_trends.replace(/\n/g, '-,-');
    ment_trends = trim_whitespace(ment_trends);

    $.post('php/update_info.php', {

        workspaces  : workspaces,
        categories  : categories,
        ment_trends : ment_trends

    }, function(data){

        // Reload everything
        load_ajax(1);

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

        var ment_trend = ment_trends[i];

        if(!ment_trend.workspace_id){
                ment_trend_html += ment_trend.name +'\n';
        }

    }
    ment_trend_html = ment_trend_html.substring(0, ment_trend_html.length - 1);

    $('#edit_info_workspaces')  .val(workspace_html);
    $('#edit_info_categories')  .val(category_html);
    $('#edit_info_ment_trends') .val(ment_trend_html);

    $('#workspace_settings_links').html('');
    var workspaces = stored_data.research_projects;
    for(var i=0; i<workspaces.length; i++){
        var workspace = workspaces[i];
        $('#workspace_settings_links').append(
            '<a href="#" data-id="'+ workspace.id +'">'+ workspace.name +'</a>'
        );
    }

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


    var trend_id        = $('#edit_trend_id')                       .val();

    var premium         = $('#edit_trend_premium')                  .val();
    var title           = $('#edit_trend_title')                    .val();
    var description     = tinyMCE.activeEditor                      .getContent();

    var videos          = get_multiple_inputs('.edit_trend_video');
    var sliderocket_id  = $('#edit_trend_sliderocket_id')           .val();

    var website         = $('#edit_trend_website')                  .val();
    var location        = $('#edit_trend_location')                 .val();

    var tags            = get_tags('#edit_trend_tagger_tagsinput');
    var categories      = get_categories('#edit_trend_categories');
    var workspace       = $('#edit_trend_workspaces')               .val();
    var ment_trend      = $('#edit_trend_ment_trends')              .val();

    // Submit info
    $.post('/php/update_trend.php', {
        trend_id        : trend_id,

        premium         : premium,
        title           : title,
        description     : description,
        videos          : videos,
        sliderocket_id  : sliderocket_id,
        website         : website,
        location        : location,

        tags            : tags,
        categories      : categories,
        workspace       : workspace,
        ment_trend      : ment_trend
    },function(data){

        load_ajax(1); // Reloads all the ajax incl. trends
        $.mobile.changePage('#manage_trends', 'pop');

        site_message('You have edited the trend "'+ title +'"');

    });

}

function setup_mentality_trends(){

    var ment_trends = stored_data.mentality_trends;
    var $container1 = $('#edit_trend_ment_trends');
    var $container2 = $('div[data-d-id="ment_trends"]');

    for(var i=0; i<ment_trends.length; i++){
        var ment_trend = ment_trends[i];
        $container1.append('<option value="'+ ment_trend.id +'">'+ ment_trend.name +'</option>');

        $container2.append(
            '<li><a href="#" data-id="'+ ment_trend.id +'">' +
                truncate(ment_trend.name, 20) +
            '</a></li>'
        );
    }

    // Wraps categories in columns
    var categories = $container2.children('li');
    var num = categories.length;
    var ceil = Math.ceil(num/3);

    for(var i=0; i<num; i+=ceil){

        categories.slice(i, i+ceil).wrapAll('<ul></ul>');

    }

}

function send_trend(that){

    $(that).attr('data-role', 'disable');

    var id = $(that).parents('div[data-id]').attr('data-id');

    site_message('Sending trend to wordpress environment...', 1);

    $.post('php/send_to_main.php', {trend_id: id}, function(data){

        site_message('Trend sent to wordpress.');

    });

}

function setup_edit_trend(that){

    reset_edit_trend_form();

    var id = $(that).parents('div[data-id]').attr('data-id');

    var trends = stored_data.trends; // gotten from database

    var trend = $.grep(trends, function(e){
        return e.id == id;
    });
    trend = trend[0];

    // Sets premium or public
    $('#edit_trend_premium').val(trend.premium).change();

    // Sets up title & description
    $('#edit_trend_title')  .val(trend.title);
    tinyMCE.activeEditor    .setContent(trend.description);

    // Sets videos
        var $container          = $('#edit_trend_videos');
        var $container_input    = $container.children();
        var videos              = trend.videos.split(',');

        if(trend.videos){
            for(var i=0; i<videos.length; i++){

                var video = videos[i];
                $container.append(
                    $container_input.clone().val(video).removeClass('cross').addClass('tick')
                );
            }
            $container.append($container_input); // Adds the input to the bottom of the list instead of staying up top
        }

    // Sets sliderocket id
        $('#sliderocket_id').val(trend.sliderocket_id);

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
    $('#edit_trend_location').val(trend.location); // Calls keyup to enable the SUBMIT button

    // Sets trend_id
    $('#edit_trend_id').val(trend.id);

    $('#edit_trend_workspaces').val(trend.research_project).change();
    $('#edit_trend_ment_trends').val(trend.ment_trend).change();

    form_stuff(1); // Refreshes form stuff
    setup_form_buttons();

    $.mobile.changePage('#edit_trend_1', 'pop');

}

function reset_edit_trend_form(){

    $('#edit_trend_premium')                    .val('').removeClass('tick').addClass('cross');

    $('#edit_trend_title')                      .val('').removeClass('tick').addClass('cross');
    tinyMCE.get('edit_trend_description')       .setContent('');
    $('#edit_trend_location')                   .val('').removeClass('tick').addClass('cross');

    $('.edit_trend_video').not(':first-child')  .remove();
    $('.edit_trend_video')                      .val('');

    $('#edit_trend_website')                    .val('').removeClass('tick').addClass('cross');

    $('#edit_trend_categories')                 .find('div').removeClass('selected');
    $('#edit_trend_tagger')                     .importTags('');
    $('#edit_trend_workspaces')                 .val('').removeClass('tick').addClass('cross');
    $('#edit_trend_ment_trends')                .val('').change().removeClass('tick').addClass('cross');

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

            // Reset some stuff

            $('#edit_password')     .val('').keyup();
            $('#edit_conf_password').val('').keyup();

            load_ajax(1); // Reloads all the ajax incl. account list

            // --

            $.mobile.changePage('#manage_accounts', 'pop');

            site_message('You have successfully edited '+ first_name +'\'s account information.');

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
    $('#edit_account_privilage').val(info.privilage.letter).change();

    // Sets workspaces
    var $container = $('#edit_account_workspaces');

    $container.find('.selected').removeClass('selected');

    if(info.project_ids){
        var workspaces = info.project_ids.split(',');
        for(var i=0; i<workspaces.length; i++){
            var workspace = workspaces[i];
            $container.find('div[data-id='+ workspace +']').addClass('selected');
        }
    }

    $('#edit_username')     .val(info.username);
    $('#edit_first_name')   .val(info.first_name);
    $('#edit_last_name')    .val(info.last_name);
    $('#edit_gender')       .val(info.gender).change();

    $('#edit_email')        .val(info.email);
    $('#edit_city')         .val(info.city);
    $('#edit_country')      .val(info.country).change();

    $('#edit_date_of_birth_1').val(info.date_of_birth.split('-')[2]);
    $('#edit_date_of_birth_2').val(info.date_of_birth.split('-')[1]);
    $('#edit_date_of_birth_3').val(info.date_of_birth.split('-')[0]);

    form_stuff(1);
    setup_form_buttons();

    $.mobile.changePage('#edit_account', 'pop');

}

function setup_accounts(search_keyword){

    var accounts    = stored_data.accounts;
    var $container  = $('#account_ul').find('[data-role="dynamic-data"]');
    var html        = '';

    if(search_keyword){
        search_keyword = search_keyword.toLowerCase();

        accounts = $.grep(accounts, function(e){

            if(!e.username) return;
            return  e.username                          .toLowerCase().indexOf(search_keyword) > -1 ||
                    e.first_name                        .toLowerCase().indexOf(search_keyword) > -1 ||
                    e.last_name                         .toLowerCase().indexOf(search_keyword) > -1 ||
                    e.email                             .toLowerCase().indexOf(search_keyword) > -1 ||
                    e.city                              .toLowerCase().indexOf(search_keyword) > -1 ||
                    e.country                           .toLowerCase().indexOf(search_keyword) > -1 ||
                    e.privilage.name                    .toLowerCase().indexOf(search_keyword) > -1 ||
                    (e.first_name +' '+ e.last_name)    .toLowerCase().indexOf(search_keyword) > -1;
        });
    }

    for(var i=0; i<accounts.length; i++){

        var account = accounts[i];

        if(typeof(account.privilage) !== 'object'){
            account.privilage = $.grep(stored_data.privilages, function(e){
                return e.letter == account.privilage;
            });
            account.privilage = account.privilage[0];
        }

        html +=
            '<li data-id="'+ account.id +'">' +
                '<span><b>'+ account.first_name +' '+ account.last_name +'</b> ('+ account.username +')</span>' +
                '<span>'+ ( account.privilage.name ? account.privilage.name : 'N.A.' )    + '</span>' +
                '<span>'+ account.email + '</span>' +
                add_extra_html() +
            '</li>';

    }

    if(!html){
        html = '<div class="message show">No accounts found</div>';
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

    // Sliderocket
    var embed_sliderocket = '';
    if(trend.sliderocket_id){

        embed_sliderocket = '<iframe frameborder="0" scrolling="no" src="http://app.sliderocket.com:80/app/fullplayer.aspx?id='+ trend.sliderocket_id +'" width="100%" height="250"></iframe>';

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
            '<div class="sliderocket">' + embed_sliderocket + '</div>' +
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

    if($(window).width() > 769){
        var window_type = 'desktop';
    }
    else {
        var window_type = 'mobile';
    }

    var type                    = $(that).parents('div').attr('data-d-id');
    var $container              = $('#trend_container');

    if(type == 'category' || type == 'ment_trends'){
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
    else if(type == 'ment_trends'){

        var attr = '';

        var ment_trend_id = $(that).parents('div[data-d-id]').find('a.active').attr('data-id');

        if(ment_trend_id){
            var attr = '[data-ment-trend='+ ment_trend_id +']';
            var $els = $container.find('div[data-ment-trend]:not('+ attr +')');
            if($els){
                $els.hide(0);
            }
        }

        $container.masonry('layout');

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

function click_view_button(that){

    var value = $(that).text().toLowerCase();

    if(value == 'all signs'){

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

function load_ajax(not_first_time, new_login){

    $.post('/php/get_info.php', function(data){

        // Store the data in a constant
        $.extend(stored_data, data);

        $.post('php/get_extra_info.php', function(data){

            // Store the data in a constant
            $.extend(stored_data, data);

            add_ajax(not_first_time, new_login); // Calls load_rest after

        }, 'JSON');

    }, 'JSON');

}

function add_ajax(not_first_time, new_login){

    // Sets up every time
    setup_trend_view();
    setup_workspace_view();
    setup_accounts();
    setup_edit_info();

    // Sets up only once
    if(!not_first_time){
        setup_categories();
        setup_mentality_trends();
        setup_workspaces();
        setup_edit_info();
        setup_privilages();
        setup_countries();

        load_rest(new_login);
    }

}

function setup_account_stuff(){

    $('#menu_icon').show(0);

    // Setup username (settings panel)
    $('#account_username').text(stored_data.user_info.username);

    // Adds extra button if Super Admin
        if(stored_data.user_info.privilage == 'f'){
            $('#settings_manage_info').show(0);
        }
        else {
            $('#settings_manage_info').remove();
        }

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
    html +=
        '<a href="#" data-id="0"  data-transition="slide" class="button no_image">' +
            '<span>1.</span> Open projects'
        '</a>';

    for(var i=0; i<workspaces.length; i++){

        var workspace = workspaces[i];

        html +=
            '<a href="#" data-id="'+ workspace.id +'"  data-transition="slide" class="button no_image">' +
                '<span>'+ (i+2) +'.</span> '+ workspace.name +
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

        if(trend.title){
            trend.link_title = '/#view_trend?id='+ trend.id +'&title='+ trend.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')

            if(trend.rating){
                var rating = (trend.rating.score_cool + trend.rating.score_potential) / 2 / trend.rating.votes;
            }
            else {
                var rating = 0;
            }

            trend_html +=
                '<div data-id="'+ trend.id +'" data-categories="'+ trend.categories +'" data-workspace="'+ trend.research_project +'" data-num-comments="'+ trend.num_comments +'" data-rating="'+ rating +'" data-views="'+ (trend.views ? trend.views : 0) +'" data-ment-trend="'+ trend.ment_trend +'">' +
                    '<a href="'+ trend.link_title +'" class="trend_link">' +
                        '<div class="image_container">' +
                        '   <img src="/images/'+ trend.images.split(',')[0] +'" alt="research project image">' +
                        '</div>' +
                        '<span>'+ (trend.premium > 0 ? '<p></p>' : '') + truncate(trend.title, 25) + (trend.on_main > 0 ? '<b></b>' : '') +'</span>' +
                    '</a>' +
                    add_extra_html(trend.on_main) +
                '</div>';
        }

    }
    if(!trends.length){

        trend_html += '<div class="message show no_float red">No trends...</div>';

    }

    $('#trend_container').html(trend_html);

    setup_other_plugins('masonry_trend');

    // -----------------------------

    // Adds the delete & remove button
    function add_extra_html(on_main) {

        var html =
            '<div class="extra">' +
                '<a href="#" class="button no_image edit">Edit</a>' +
                '<a href="#" class="button no_image" '+ (on_main > 0 ? ' data-role="disable"' : '') +'>Send to main</a>' +
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
        $('#edit_country').parent() .hasClass('tick') &&

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
        $('#edit_info_workspaces')  .hasClass('tick') &&
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
        else if(stored_data.user_info.privilage !== 'e' && stored_data.user_info.privilage !== 'f'){
            $.mobile.changePage('/iadmin/', 'pop');
        }

    }

    if(location.hash == '#manage_trends'){

        if(not_first_page_load){

            if($('#trend_container').attr('style')){
                $('#trend_container').masonry('destroy');
            }

            setTimeout(function(){
                $('#trend_container').masonry({
                    columnWidth: 75.5
                });
            }, 200);

        }

    }

    if(if_not_home_page()){
        console.log('not home page');
        $('#back_icon').show(0);
        $('#menu_icon').hide(0);
    }
    else {
        console.log('home page');
        $('#back_icon').hide(0);

        if(logged_in){
            $('#menu_icon').show(0);
        }
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