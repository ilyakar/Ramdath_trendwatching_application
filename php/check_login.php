<?php

include 'php_includes.php';

$username   = $_POST['username'];
$password   = $_POST['password'];

$md5        = $_POST['md5'];

$type       = $_POST['type'];
$extra_info = $_POST['extra_info']; // In case this is a new user, all the necessary info will be gotten from here

// Clean for MySQL
$username   = mysql_real_escape_string($username);
$password   = mysql_real_escape_string($password);

// Encrypt the password
if($md5 == 1){
//    print 1;
    $password = md5($password);
}

$rows = '';
$sql = mysql_query("SELECT * FROM accounts WHERE username='$username' AND password='$password'");
while($row = mysql_fetch_array($sql)) {
    $rows['user_info'] = $row;
}

if($type == 'facebook'){

    $num = mysql_num_rows($sql);
    if($num < 1){ // Cause we got the data from facebook, if the data is not in our db, the info is still correct cause it's from facebook

    //  $username
        $first_name     = $extra_info['first_name'];
        $last_name      = $extra_info['last_name'];
        $date_of_birth  = '';
        $gender         = $extra_info['gender'];
    //  $password
        $email          = '';
        $city           = explode(', ', $extra_info['hometown']['name'])[0];
        $country        = explode(', ', $extra_info['hometown']['name'])[1];
        $profile_image  = '';
        $project_ids    = '';


        mysql_query("INSERT INTO accounts (
        username,
        first_name,
        last_name,
        date_of_birth,
        gender,
        password,
        email,
        city,
        country,
        profile_image,
        project_ids) VALUES (
        '$username',
        '$first_name',
        '$last_name',
        '$date_of_birth',
        '$gender',
        '$password',
        '$email',
        '$city',
        '$country',
        '$profile_image',
        '$project_ids'
        )") or die(mysql_error());

        $sql = mysql_query("SELECT * FROM accounts WHERE username='$username' AND password='$password'");
        while($row = mysql_fetch_array($sql)) {
            $rows['user_info'] = $row;
        }

    }

}

print json_encode($rows);