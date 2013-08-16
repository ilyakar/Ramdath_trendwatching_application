<?php

include 'connect_to_mysql.php';

$sql = mysql_query("SELECT * FROM trends");
while($row = mysql_fetch_array($sql)) {

    // Decodes all the encoded info
    $row['title']       = urldecode($row['title']);
    $row['description'] = urldecode($row['description']);
    $row['tags']        = urldecode($row['tags']);
    $row['categories']  = urldecode($row['categories']);
    $row['location']    = urldecode($row['location']);
    // --

    $row['num_comments'] = 0;

    $id = $row['id'];

    $sql2 = mysql_query("SELECT * FROM comments WHERE trend_id='$id'");
    while($row2 = mysql_fetch_array($sql2)){

        $row['num_comments'] = mysql_num_rows($sql2);

    }

    $sql2 = mysql_query("SELECT * FROM rater WHERE trend_id='$id'");
    while($row2 = mysql_fetch_array($sql2)) {
        $row['rating']['value']    = $row2['value'];
        $row['rating']['votes']    = $row2['votes'];
        $row['rating']['user_ids'] = $row2['user_ids'];
    }

    $trends[] = $row;
}

$num = count($trends);
for($i=0; $i<$num; $i++){

    // ---
    $trend = $trends[$i];

    $rating = $trend['rating']['value'] / $trend['rating']['votes'];

    if(!$rating){
        $rating = 0;
    }
    // ---

    // --- image size stuff ---
    $container_width    = 400;
    $container_height   = 275;
    $width              = getimagesize('../images/'. explode(',', $trend['images'])[0] )[0];
    $height             = getimagesize('../images/'. explode(',', $trend['images'])[0] )[1];

    $new_height = $container_width / $width * $height;

    // Height 100%
    if($new_height < $container_height){ // If we make width 100% and height is smaller than the container, then the height has to be 100% and width bigger
        $new_height = $container_height;
        $new_width = $new_height / $height * $width;
    }

    // Width 100%
    else {
        $new_width = $container_width;
    }

    // ---

    if($i<6){ // No lazyload
        $img_extra = 'src="/images/'. explode(',', $trend['images'])[0] .'"';
    }
    else { // Lazyload for the rest
        $img_extra = 'class="lazyload" src="/style/images/transparent.png" data-original="/images/'. explode(',', $trend['images'])[0] .'"';
    }

    $trend['link_title'] = preg_replace('!\s+!', ' ', $trend['title']);
    $trend['link_title'] = str_replace(',', '', $trend['link_title']);
    $trend['link_title'] = strtolower($trend['link_title']);
    $trend['link_title'] = preg_replace('/[^a-z0-9]/i', '-', $trend['link_title']);

    $trend['link_title'] = 'view_trend?id='. $trend['id'] .'&title='. $trend['link_title'];

    $t_num = $i+1 < 10 ? '0'.($i+1) : $i+1;

    print
        '<div data-categories="'. $trend['categories'] .'" data-num-comments="'. $trend['num_comments'] .'" data-rating="'. $rating .'" data-views="'. ($trend['views'] ? $trend['views'] : 0) .'">
            <div class="image_container">
                <a href="#'. $trend['link_title'] .'" data-transition="slide">View trend</a>
                <img '. $img_extra .' width="'. $new_width .'" height="'. $new_height .'" alt="trend pic" />
            </div>
            <section>
                <header><h1><i>'. $t_num .'</i>'. truncate($trend['title'], 25) .'</h1></header>
                '. truncate($trend['description'], 400) .'
            </section>
        </div>';

}

function truncate($text, $chars = 25) {
    $text = $text." ";
    $text = substr($text,0,$chars);
    $text = substr($text,0,strrpos($text,' '));
    $text = $text."...";
    return $text;
}