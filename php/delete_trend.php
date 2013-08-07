<?php

include 'php_includes.php';

$trend_id   = $_POST['trend_id'];

mysql_query("INSERT INTO trends_trash SELECT * FROM trends WHERE id='$trend_id'") or die(mysql_error());

mysql_query("DELETE FROM trends WHERE id='$trend_id'") or die(mysql_error());

?>