<?php

include 'php_includes.php';

$file_name  = $_POST['filename'];
$dir        = '../uploads/';

// Adjust image name
$file_name = urldecode($file_name);
$file_name = str_replace(' ', '-', $file_name);
$file_name = urlencode($file_name);

// Get extension
$extension = pathinfo($dir.$file_name, PATHINFO_EXTENSION);

// Image without extension
$file_name = explode('.', $file_name);
$file_name = $file_name[0];

// Check if image with that name already exists (if so, rename this one a bit)
$num              = count(glob($dir.$file_name .'.*')) + count(glob($dir.$file_name .'%5B*')); // Either ".", or "["
if($num > 1){
    $file_name = urldecode($file_name);
    $file_name = $file_name .'['. $num .']';
    $file_name = urlencode($file_name);
}

print $file_name .'.'. $extension;