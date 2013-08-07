<?php

include 'php_includes.php';

$user_id            = $_POST['user_id'];
$uploaded_images    = $_POST['uploaded_images'];

$title              = urlencode($_POST['title']);
$description        = urlencode($_POST['description']);
$tags               = urlencode($_POST['tags']);
$categories         = urlencode($_POST['categories']);
$location           = urlencode($_POST['location']);

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
mysql_query("INSERT INTO trends (user_id, images, title, description, tags, categories, location) VALUES ('$user_id', '$files', '$title', '$description', '$tags', '$categories', '$location')") or die(mysql_error());
$trend_id = mysql_insert_id();

mysql_query("INSERT INTO rater (trend_id) VALUES ('$trend_id')");

// ------------ Get values to return ------------
    $sql = mysql_query("SELECT * FROM rater");
    while($row = mysql_fetch_array($sql)) {
        $rows['rater'][] = $row;
    }

    $sql = mysql_query("SELECT * FROM trends WHERE id='$trend_id'");
    while($row = mysql_fetch_array($sql)) {

        // Decodes all the encoded info
        $row['title']       = urldecode($row['title']);
        $row['description'] = urldecode($row['description']);
        $row['tags']        = urldecode($row['tags']);
        $row['categories']  = urldecode($row['categories']);
        $row['location']    = urldecode($row['location']);
        // --

        $rows['trend'] = $row;
    }
// -----------------------------------------------

print json_encode($rows);

?>