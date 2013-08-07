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

    print $password;

}