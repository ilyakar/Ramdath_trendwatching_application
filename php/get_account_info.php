<?php

include 'php_includes.php';

$user_id = $_POST['user_id'];

$sql = mysql_query("SELECT * FROM accounts WHERE id='$user_id'");
while($row = mysql_fetch_array($sql)){
    $rows = $row;
}

print json_encode($rows);