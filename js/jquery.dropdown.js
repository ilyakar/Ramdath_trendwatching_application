stop_dropdown_hide = '';
disable_dropdown_panel_set = '';

$(function(){
    // Add the class ".arrow" to the li containing the dropdown
    $('.dropdown_ul > li > ul').parent('li').children('a').addClass('arrow');
});

$(window).load(function() {

    d_timeout=new Array(); // dropdown timeout - create array

    //----- editable -----
    //--------------------
    dropdown_hide_timeout = 400;
    dropdown_speed = 300;
    //--------------------
    //--------------------

    //--- ">" = only get the first of the li (otherwise it'll show all the dropdowns at once ----
    $('.dropdown_ul > li').hover(function(){

        // Index of the UL (parent of the li we hovered)
        var ul_index = $(this).parent('ul').index('ul.dropdown_ul');

        // If the admin_panel UL dropdown has been set to be disabed, disable it
        if(disable_dropdown_panel_set && ul_index == 0){
            return;
        }

        // Index of the LI we hovered
        var li_index = $(this).index(); // gets the index 0/1/2/3 of the parent li

        // index of the two values
        index = ul_index+'-'+li_index;

        clearTimeout(d_timeout[index]);

        $('.dropdown_ul:eq('+ul_index+') > li:eq('+li_index+') > ul').fadeIn(dropdown_speed); // show dropdown

    }, function(){
        hide_dropdown(index); // e.g. 0-1 (1st ul, 2nd li)
    });

});

function hide_dropdown(index){

    d_timeout[index] /* dropdown timeout */ = setTimeout(function(){

        if(stop_dropdown_hide){
            return;
        }

        var ul_index = index.split('-')[0];
        var li_index = index.split('-')[1];

        $('.dropdown_ul:eq('+ul_index+') > li:eq('+li_index+') > ul').fadeOut(dropdown_speed-200);

    },dropdown_hide_timeout);

}


function disable_dropdown_panel(undisable){

    // Make sure the user is logged in
    if(!logged_in){
        return;
    }

    if(!undisable){
        $('.dropdown_ul:eq(0) ul').fadeOut(dropdown_speed-200);
        disable_dropdown_panel_set = 1;
    }
    else {
        disable_dropdown_panel_set = '';
    }

}