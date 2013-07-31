<?php

include 'php_includes.php';

$comment    = urlencode($_POST['comment']);
$trend_id   = $_POST['trend_id'];

mysql_query("DELETE FROM comments WHERE trend_id='$trend_id' AND comment='$comment'") or die(mysql_error());

?>