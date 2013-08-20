<?php

include 'connect_to_mysql.php';

$sql = mysql_query("SELECT * FROM trends ORDER BY id DESC");
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

    if($trend['rating']['votes']){
        $rating = $trend['rating']['value'] / $trend['rating']['votes'];
    }
    else {
        $rating = 0;
    }
    // ---

    $trend['first_image']   = explode(',', $trend['images']);
    $trend['first_image']   = $trend['first_image'][0];

    // --- image size stuff ---
    $container_width    = 400;
    $container_height   = 275;

    $info               = getimagesize('../images/'. $trend['first_image'] );
    $width              = $info[0];
    $height             = $info[1];

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
        $img_extra = 'src="/images/'. $trend['first_image'] .'"';
    }
    else { // Lazyload for the rest
        $img_extra = 'class="lazyload" src="/style/images/transparent.png" data-original="/images/'. $trend['first_image'] .'"';
    }

    $trend['link_title'] = preg_replace('!\s+!', ' ', $trend['title']);
    $trend['link_title'] = str_replace(',', '', $trend['link_title']);
    $trend['link_title'] = strtolower($trend['link_title']);
    $trend['link_title'] = preg_replace('/[^a-z0-9]/i', '-', $trend['link_title']);

    $trend['link_title'] = 'view_trend?id='. $trend['id'] .'&title='. $trend['link_title'];

    $t_num = $i+1 < 10 ? '0'.($i+1) : $i+1;

    print
        '<div data-id="'. $trend['id'] .'" data-categories="'. $trend['categories'] .'" data-num-comments="'. $trend['num_comments'] .'" data-rating="'. $rating .'" data-views="'. ($trend['views'] ? $trend['views'] : 0) .'">
            <a href="#'. $trend['link_title'] .'" class="trend_link image_container" data-transition="slide">
                <span>View trend</span>
                <img '. $img_extra .' width="'. $new_width .'" height="'. $new_height .'" alt="trend pic" />
            </a>
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