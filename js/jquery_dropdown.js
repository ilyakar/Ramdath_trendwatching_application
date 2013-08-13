$.fn.dropdown = function( options ) {

    // Settings
    var settings = $.extend({
        dropdown_connector: 'data-d-id'
    }, options );

    // Setup variables
    var $this = this;
    var d_timeout = new Array();
    var id, hide_list;

    dropdown_hide_timeout = 400;
    dropdown_speed = 300;

    $this.find('a[data-d-id]').click(function(){

        if($(this).hasClass('selected')){
            hide_list = 1;
        }
        else {
            hide_list = 0;
        }

        var id = $(this).attr('data-d-id');

        // Hides all shows id
        hide('all', 1);

        if(!hide_list){
            show(id);
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

        $('[data-d-id="'+ id +'"]').addClass('selected');

    }

    function hide(id, immediate){

        if(!immediate){
            d_timeout[id] /* dropdown timeout */ = setTimeout(function(){

                $('[data-d-id="'+ id +'"]').removeClass('selected');

            },dropdown_hide_timeout);
        }
        else if(id == 'all') { // Close everything
            $('[data-d-id]').removeClass('selected');
        }
        else {
            clearTimeout(d_timeout[id]);
            $('[data-d-id="'+ id +'"]').removeClass('selected');
        }

    }

}