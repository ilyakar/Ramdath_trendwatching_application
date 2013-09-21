<?php

include 'php_includes.php';

$account_id     = $_POST['account_id'];

$first_name     = $_POST['first_name'];
$last_name      = $_POST['last_name'];
$date_of_birth  = $_POST['date_of_birth'];
$gender         = $_POST['gender'];
$email          = $_POST['email'];
$city           = $_POST['city'];
$country        = $_POST['country'];

$password       = $_POST['password'];

$privilage      = $_POST['privilage'];
$workspaces     = $_POST['workspaces'];

mysql_query("UPDATE accounts SET
first_name='$first_name',
last_name='$last_name',
date_of_birth='$date_of_birth',
gender='$gender',
email='$email',
city='$city',
country='$country'

WHERE id='$account_id'") or die(mysql_error());

if($password) {
    $password = md5($password);

    mysql_query("UPDATE accounts SET password='$password' WHERE id='$account_id'") or die(mysql_error());

    $data['password'] = $password;

}

// Edit by admin
    if($privilage){

        mysql_query("UPDATE accounts SET privilage='$privilage' WHERE id='$account_id'") or die(mysql_error());

    }

    if($workspaces){

        mysql_query("UPDATE accounts SET project_ids='$workspaces' WHERE id='$account_id'") or die(mysql_error());

    }



// Upload profile image if it's there
$output_dir = "../uploads/";

if(isset($_FILES["profile_image"]))
{

    $img    = $_FILES["profile_image"]['tmp_name'];
    $size   = getimagesize($img);

    $width  = $size[0];
    $height = $size[1];

    // Get image
    $img = new SimpleImage($img); // gets from the upload field

    // -- Manipulate image --
    if($height > $width){ // If image is too heigh
        $img->fit_to_width(65);
    }
    else { // If image is too wide
        $img->fit_to_height(65);
    }
    $img->crop(0, 0, 65, 65);
    // ----------------------

    list($width, $height, $type, $attr) = getimagesize($img);

    $extension = image_type_to_extension($type, true);

    // New filepath
    $rand_name = substr(str_shuffle(str_repeat('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 25)), 0, 25);
    $img_name = $rand_name .'.jpg';
    $img_path = '../images/'. $img_name;

    $img->save($img_path, 80); // quality 80%

    mysql_query("UPDATE accounts SET profile_image='$img_name' WHERE id='$account_id'") or die(mysql_error());

    $data['profile_image'] = $img_path;

}

print json_encode($data);