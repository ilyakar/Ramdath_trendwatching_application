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

$data = [];

mysql_query("UPDATE accounts SET
first_name='$first_name',
last_name='$last_name',
date_of_birth='$date_of_birth',
gender='$gender',
email='$email',
city='$city',
country='$country'

WHERE

id='$account_id'

") or die(mysql_error());

if($password) {
    $password = md5($password);

    mysql_query("UPDATE accounts SET
    password='$password'

    WHERE

    id='$account_id'

    ") or die(mysql_error());

    $data['password'] = $password;

}

// Upload profile image if it's there
$output_dir = "../uploads/";

if(isset($_FILES["profile_image"]))
{

    $img = WideImage::load('profile_image'); // gets from the upload field

    // -- Manipulate image --
    $img = $img->resize(65)->resizeCanvas(65, 65, 0, 0);
    // ----------------------

    list($width, $height, $type, $attr) = getimagesize($img);

    $extension = image_type_to_extension($type, true);

    // New filepath
    $rand_name = substr(str_shuffle(str_repeat('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 25)), 0, 25);
    $img_name = $rand_name .'.jpg';
    $img_path = '../images/'. $img_name;

    $img->saveToFile($img_path, 80); // quality 80%

    mysql_query("UPDATE accounts SET profile_image='$img_name' WHERE id='$account_id'") or die(mysql_error());

    $data['profile_image'] = $img_path;

}

print json_encode($data);