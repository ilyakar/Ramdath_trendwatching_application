$.fn.dropdown = function( options ) {

    // Settings
    var settings = $.extend({
        dropdown_connector: 'data-d-id'
    }, options );

    // Setup variables
    var $this = this;
    var d_timeout = new Array();
    var id;

    dropdown_hide_timeout = 400;
    dropdown_speed = 300;

    //--- ">" = only get the first of the li (otherwise it'll show all the dropdowns at once ----
    $this.find('a[data-d-id]').click(function(){

        var id = $(this).attr('data-d-id');

console.log($(this).attr('class'));
        // Not selected
        if(!$(this).hasClass('selected')){
            show(id);
            clearTimeout(d_timeout[id]);
        }

        // Selected
        else {
            console.log('hide');
            hide(id, 1);
        }

    });

    $this.find('[data-d-id]').hover(function(){

        var id = $(this).attr('data-d-id');
        clearTimeout(d_timeout[id]);

    },function(){

        var id = $(this).attr('data-d-id');
        hide(id);

    });

    function show(id){

        $('a[data-d-id="'+ id +'"], div[data-d-id="'+ id +'"]').addClass('selected');

    }

    function hide(id, immediate){

        if(!immediate){
            d_timeout[id] /* dropdown timeout */ = setTimeout(function(){

                $('a[data-d-id="'+ id +'"], div[data-d-id="'+ id +'"]').removeClass('selected');

            },dropdown_hide_timeout);
        }
        else {
            clearTimeout(d_timeout[id]);
            $('a[data-d-id="'+ id +'"], div[data-d-id="'+ id +'"]').removeClass('selected');
        }

    }

}