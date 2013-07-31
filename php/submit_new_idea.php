<?php

include 'php_includes.php';

$title              = urlencode($_POST['title']);
$description        = urlencode($_POST['description']);
$tags               = urlencode($_POST['tags']);
$categories         = urlencode($_POST['categories']);
$location           = urlencode($_POST['location']);

$uploaded_images    = $_POST['uploaded_images'];

//$title = urlencode('asda');
//$description = urlencode('tesco');
//$tags = urlencode('lidl');
//$categories = urlencode('categroeies');
//$location = urlencode('asda');
//$uploaded_images = 'Fiat-Bravo-Wolverine-09-360x230.jpg';

//print $uploaded_images.'--------------';
// Moves and removes the uploaded images
    $uploaded_images = explode(',', $uploaded_images);
    $num = count($uploaded_images);

    $files = '';

    for($i=0; $i<$num; $i++){

        // Orig filepath
        $file       = $uploaded_images[$i];
        $filepath   = '../uploads/' . $file;
        $extension  = pathinfo($filepath, PATHINFO_EXTENSION);

        // New filepath
        $rand_name = substr(str_shuffle(str_repeat('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 25)), 0, 25);
        $newfile        = $rand_name .'.'. $extension;
        $newfile_path   = '../images/' . $newfile;

        if (copy($filepath, $newfile_path)) {
            unlink($filepath);
        }

        $files .= $newfile.',';

    }
    $files = substr_replace($files, '', -1);

$description = nl2p($description);

// Add all the info to database
mysql_query("INSERT INTO trends (user_id, images, title, description, tags, categories, location) VALUES (1, '$files', '$title', '$description', '$tags', '$categories', '$location')") or die(mysql_error());
$trend_id = mysql_insert_id();

mysql_query("INSERT INTO rater (trend_id) VALUES ('$trend_id')");

?>