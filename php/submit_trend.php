<?php

include 'php_includes.php';

$user_id            = $_POST['user_id'];
$uploaded_images    = $_POST['uploaded_images'];

$title              = urlencode($_POST['title']);
$description        = urlencode($_POST['description']);
$videos             = urlencode($_POST['videos']);
$website            = urlencode($_POST['website']);
$location           = urlencode($_POST['location']);

$tags               = urlencode($_POST['tags']);
$categories         = urlencode($_POST['categories']);
$workspace          =           $_POST['workspace'];
$ment_trend         = urlencode($_POST['ment_trend']);

// Moves and removes the uploaded images
    $uploaded_images = explode(',', $uploaded_images);
    $num = count($uploaded_images);

    $files = '';

    for($i=0; $i<$num; $i++){

        $file       = $uploaded_images[$i];

        // Get orig filepath
        $file_path  = '../uploads/' . $file;

        mysql_log($file_path);

        // Get extension
        $extension  = pathinfo($file_path, PATHINFO_EXTENSION);

        // New filepath
        $rand_name = substr(str_shuffle(str_repeat('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 25)), 0, 25);
        $new_file        = $rand_name .'.'. $extension;
        $new_file_path   = '../images/' . $new_file;

        if (copy($file_path, $new_file_path)) {
//            unlink($file_path);
        }

        $files .= $new_file.',';

    }
    $files = substr_replace($files, '', -1);

// Add all the info to database
mysql_query("INSERT INTO trends (
user_id,
images,

title,
description,
videos,
website,
location,

tags,
categories,
research_project,
ment_trend
) VALUES (
'$user_id',
'$files',

'$title',
'$description',
'$videos',
'$website',
'$location',

'$tags',
'$categories',
'$workspace',
'$ment_trend'
)") or die(mysql_error());
$trend_id = mysql_insert_id();

// ------------ Get values to return ------------
    $sql = mysql_query("SELECT * FROM trends WHERE id='$trend_id'");
    while($row = mysql_fetch_array($sql)) {

        // Decodes all the encoded info
        $row['title']       = urldecode($row['title']);
        $row['description'] = urldecode($row['description']);
        $row['tags']        = urldecode($row['tags']);
        $row['categories']  = urldecode($row['categories']);
        $row['location']    = urldecode($row['location']);
        // --

        $sql2 = mysql_query("SELECT * FROM rater WHERE trend_id='$trend_id'");
        while($row2 = mysql_fetch_array($sql2)) {
            $row['rating']['value']    = $row2['value'];
            $row['rating']['votes']    = $row2['votes'];
            $row['rating']['user_ids'] = $row2['user_ids'];
        }

        $rows['trend'] = $row;
    }
// -----------------------------------------------

print json_encode($rows);