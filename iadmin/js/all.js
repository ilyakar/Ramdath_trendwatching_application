// ----- Primary setup -----
$(function(){

    // Definitions
    setup_definitions();

    // Check if internet connection dead
    var dead_internet = check_internet_connection();
    if(dead_internet) return;

    // Global click functions
    global_click_functions();

    // Setup critical plugins
    setup_critical_plugins();

    check_login(); // -> then calls load_rest();

});

// ----- Secondary setup -----
function load_rest(){

    // Init global_page_functions on start AND page change
    on_page_change();

    // Plugin setup
//    setup_other_plugins('all');

    // Form stuff
    form_stuff();

    // Show app
    loader('hide');

}

// ------------------------------ Primary setup ------------------------------

function setup_definitions(){

    logged_in                       = '';

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

    ///

}

function check_login(){

    var username    = $.cookie('admin_username_cookie');
    var password    = $.cookie('admin_password_cookie');

    if(username && password){
        $.post('/php/check_login.php', {

            username    : username,
            password    : password
        }, function(data){

            if(data.user_info){
                console.log('logged in');
                $.extend(stored_data, data);
                logged_in = 1;
            }
            else {
                console.log('not logged in');
                $.removeCookie('username_cookie');
                $.removeCookie('password_cookie');
            }

            load_rest();

        }, 'JSON');

    }
    else {
        load_rest();
    }

}

// ------------------------------ Secondary setup ------------------------------

function on_page_change(){

    global_page_functions();

    // Runs on page change
    $(document).delegate('.ui-page', 'pagebeforeshow', function () {
        global_page_functions();
    });

}

function global_click_functions(){

    $('#submit_login').click(function(){

        if($(this).attr('data-role') == 'disable') return;

        $.cookie('admin_username_cookie',     $('#login_username').val() );
        $.cookie('admin_password_cookie', md5($('#login_password').val()));
console.log('check');
        check_login();

    });

}

function form_stuff(){

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

}

// ---------------- Other functions (called by other functions) -----------------

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

}

function loader(type){

    type == 'hide' ? $('#page_loading').fadeOut(200) : $('#page_loading').fadeIn(200);

}

function global_page_functions(){

    ///

}

// -------- Collection of different functions ---------

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