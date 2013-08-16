$.fn.comments = function( options ) {

    // Settings
    var settings = $.extend({
        get_comments_url    : '../php/get_comments.php',
        post_comment_url    : '../php/post_comment.php',
        delete_comment_url  : '../php/delete_comment.php',
        label_text          : 'Comments',
        placeholder         : 'Add a comment...',
        trend_id            : 0,
        author              : {
            id:             0,
            username:       null,
            image:          null
        },
        onsubmit            : function () {}

    }, options );

    // Setup variables
    var $this = this;

    // --- Get comments ---

        $.post(settings.get_comments_url, {
            trend_id: settings.trend_id
        }, function(data){ // returns data.authors && data.comments

            if(!data.comments) return;

            var num_comments = data.comments.length;

            for(var i=0; i<num_comments; i++){

                var comment = data.comments[i];

                // Gets the author of the current comment
                var author = $.grep(data.authors, function(e){
                    return e.id == comment.author_id;
                });
                author = author[0];

                // Either create a delete comment link or not
                if(author.id == settings.author.id) {

                    // The comment is by the currently logged in account
                    var del = 1;

                }
                else {
                    var del = '';
                }

                insert_comment(author.username, author.profile_image, comment.date_time, decodeURIComponent(comment.comment), del);

            }

            setup_delete();

        }, 'JSON');

    // --- Setup plugin ---

        if(settings.author.id > 0) { // Setup comment post form if logged in

            // Starting HTML
            $this.html(
                '<label>'+ settings.label_text +'</label>' +
                '<div class="message red">Thank you for commenting.</div>' +
                '<form>' +
                    '<textarea placeholder="'+ settings.placeholder +'" name="comment"></textarea>' +
                    '<a href="#" class="submit_comment_button button no_image">Submit comment</a>'+
                '</form>' +
                '<ul></ul>'
            );

            // On submit
            this.find('.submit_comment_button').click(function(){

                if($(this).attr('data-role') == 'disable') return; // If the button is disabled, stop

                var comment     = $this.find('textarea:visible').val();

                comment = nl2br(comment);

                // Create date

                    var d = new Date();

                    // Date
                        var date = d.getUTCDate();
                        var month = d.getUTCMonth() + 1;
                        var year = d.getUTCFullYear();

                    // Time
                        var hours = d.getUTCHours();

                    // Turn to AM or PM
                        if(hours < 12){
                            var type = 'AM';
                        }
                        else {
                            var type = 'PM';
                            hours = hours - 12;
                        }

                    var minutes = d.getUTCMinutes();

                    var date = date +'/'+ month +'/'+ year;
                    var time = hours +':'+ minutes +type;

                    var date_time = date+' at '+time;

                $.post(settings.post_comment_url, {
                    trend_id: settings.trend_id,
                    author_id: settings.author.id,
                    date_time: date_time,
                    comment: comment // Encode for database
                }, function(data){
                    console.log(data);
                    insert_comment(settings.author.username, settings.author.image, date_time, comment, 1, 1);
                    settings.onsubmit();

                    setup_delete();
                });

            });

        }
        else { // If not logged in, fetched comments go here

            $this.html('<ul></ul>');

        }

    // ---- Functions ----

        // Insert comment
        function insert_comment(username, profile_image, date, comment, del, new_comment){

            if(del){
                del = '<a href="#" class="delete">delete</a>';
            }
            if(new_comment){
                var hidden = ' class="hidden"';
            }
            else {
                var hidden = '';
            }

            if(profile_image){
                profile_image = '/images/'+ profile_image;
            }
            else {
                profile_image = '/style/images/default_profile_image.jpg';
            }

            $this.find('ul').prepend(
                '<li'+hidden+'>' +
                    '<header>'+username +'<time>'+ date +'</time>'+ del +'</header>' +
                    '<img src="'+profile_image+'" alt="profile picture">' +
                    '<section>'+ comment +'</section>' +
                '</li>'
            );

            if(new_comment){

                // Removes form
                $this.find('form').fadeOut(200);
                setTimeout(function(){
                    // Kill the form
                    $this.find('form').remove();

                    // Adds the thank you message
                    $this.find('.message').addClass('show');

                    // Hide message
                    setTimeout(function(){
                        $this.find('.message').removeClass('show');
                    }, 3000);

                },200);

                // Adds the comment
                $this.find('ul').find('li.hidden').fadeIn(200);

            }

        }

        function setup_delete(){
            $this.find('.delete').click(function(){

                var $comment_container = $(this).parents('li');
                var comment = $comment_container.find('section').html();
                var comment = comment;

                if(confirm('Are you sure you want to remove this comment?')){

                    $.post(settings.delete_comment_url, {
                        comment:    comment,
                        trend_id:   settings.trend_id
                    },function(){

                        // Kill the comment from the DOM
                            $comment_container.fadeOut(200);
                            setTimeout(function(){
                                $comment_container.remove();
                            }, 200);

                    });

                }

            });
        }

        function nl2br (str, is_xhtml) {
            var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
            return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
        }

}