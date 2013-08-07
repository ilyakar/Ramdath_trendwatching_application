<?php

include 'php_includes.php';

$first_name     = $_POST['first_name'];
$last_name      = $_POST['last_name'];
$username       = $_POST['username'];
$date_of_birth  = $_POST['date_of_birth'];
$gender         = $_POST['gender'];
$password       = $_POST['password'];
$email          = $_POST['email'];
$city           = $_POST['city'];
$country        = $_POST['country'];

$password = md5($password);

mysql_query("INSERT INTO accounts (
first_name,
last_name,
username,
date_of_birth,
gender,
password,
email,
city,
country
) VALUES (
'$first_name',
'$last_name',
'$username',
'$date_of_birth',
'$gender',
'$password',
'$email',
'$city',
'$country'
)") or die(mysql_error());

print $password;