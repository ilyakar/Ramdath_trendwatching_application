$(function(){

    var $els = $('select');
    var num = $els.length;

    for(var i=0; i<num; i++){

        var $el = $els.eq(i);
        $el.wrap('<div class="select cross" />');

        var $wrapper = $el.parent(); // div.select

        var select_name = $el.children().eq(0).text();
        $wrapper.prepend('<span>'+select_name+'</span>');

        // Change option upon select
        $el.change(function(){

            var option = $el.find(':selected').text();
            $wrapper.children('span').text(option);

        });

    }

});