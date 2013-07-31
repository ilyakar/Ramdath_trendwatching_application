<?php

include 'php_includes.php';

$trend_id   = $_POST['trend_id'];
$rating     = $_POST['rating'];
$user_id    = $_POST['user_id'];

$sql = mysql_query("SELECT * FROM rater WHERE trend_id='$trend_id'");
while($row = mysql_fetch_array($sql)) {
    $value      = $row['value'];
    $votes      = $row['votes'];
    $user_ids   = $row['user_ids'];
}

$value = $value + $rating;
$votes = $votes + 1;

if($user_ids)   $user_ids = $user_ids.','.$user_id;
else            $user_ids = $user_id;

mysql_query("UPDATE rater SET value='$value', votes='$votes', user_ids='$user_ids' WHERE trend_id='$trend_id'");

?>