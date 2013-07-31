<?php

include 'php_includes.php';

$username   = $_POST['username'];
$password   = $_POST['password'];

// Clean for MySQL
$username   = mysql_real_escape_string($username);
$password   = mysql_real_escape_string($password);

// Encrypt the password
$password = md5($password);

$sql = mysql_query("SELECT * FROM accounts WHERE username='$username' AND password='$password'");

if(mysql_num_rows($sql) > 0){ // Only prints something if email and password are correct
    print $password;
}

?>