<?php

include 'php_includes.php';

$trend_id   = $_POST['trend_id'];
$author_id  = $_POST['author_id'];
$date_time  = $_POST['date_time'];
$comment    = urlencode($_POST['comment']);

mysql_query("INSERT INTO comments (trend_id, author_id, comment, date_time) VALUES ('$trend_id', '$author_id', '$comment', '$date_time')");

print $comment;

?>