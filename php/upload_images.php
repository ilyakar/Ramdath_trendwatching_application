<?php

include 'php_includes.php';

// ---- Get user data ----

$username   = $_COOKIE['username_cookie'];
$password   = $_COOKIE['password_cookie'];

// Clean for MySQL
$username   = mysql_real_escape_string($username);
$password   = mysql_real_escape_string($password);

$rows = '';
$sql = mysql_query("SELECT * FROM accounts WHERE username='$username' AND password='$password'");
while($row = mysql_fetch_array($sql)) {
    $rows['user_info'] = $row;
}

// ----------------------

//print json_encode($rows);

if (!empty($_FILES)) {

    // If we're uploading using phone upload system
    if(!is_array($_FILES['file']['name'])){ // Not an array when using phone upload system
        $file_tmp_name  = $_FILES['file']['tmp_name'];
        $file_name      = $_FILES['file']['name'];
        do_image($rows, $file_tmp_name, $file_name);
    }
    else {
        $cnt = 0;
        foreach ($_FILES['file']['name'] as $filename)
        {

            $file_tmp_name  = $_FILES['file']['tmp_name'][$cnt];
            $file_name      = $_FILES['file']['name'][$cnt];

            do_image($rows, $file_tmp_name, $file_name);

            $cnt++;

        }
    }
}

function do_image($rows, $file_tmp_name, $file_name){

    // Dir
    $dir = '../uploads/';

    // Get image
    $file = new SimpleImage($file_tmp_name); // gets from the upload field
//
    // Manipulate image
    $file->fit_to_width(800);

//         Adjust image name
    $file_name = urldecode($file_name);
    $file_name = str_replace(' ', '-', $file_name);
    $file_name = $rows['user_info']['id'] .'_'. $file_name; // Add account id to image name
    $file_name = urlencode($file_name);

    // Get extension
    $extension = pathinfo($dir.$file_name, PATHINFO_EXTENSION);

//         Image without extension
    $file_name = explode('.', $file_name);
    $file_name = $file_name[0];

    // Check if image with that name already exists (if so, rename this one a bit)
    $num = count(glob($dir.$file_name .'.*') + glob($dir.$file_name .'%5B*')); // Either ".", or "["
    if($num > 0){
        $file_name = urldecode($file_name);
        $file_name = $file_name .'['. ($num+1) .']';
        $file_name = urlencode($file_name);
    }

    // Image path with correct extension
    $file_path = $dir.$file_name .'.'. $extension;

    // Upload
    $file->save($file_path);

}