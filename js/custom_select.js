$(function(){

    var $els = $('select');
    var num = $els.length;

    for(var i=0; i<num; i++){

        var $el = $els.eq(i);
//        console.log($el);
        $el.wrap('<div class="select cross" />');

        var $wrapper = $el.parent(); // div.select

        var select_name = $el.children().eq(0).text();
        $wrapper.prepend('<span>'+select_name+'</span>');

        // Change option upon select
        $el.change(function(){

            var option = $(this).find(':selected').text();
            $(this).parent().children('span').text(option);

        });

    }

});