<?php

include 'php_includes.php';

$type   = $_POST['type'];
$val    = $_POST['val'];

$sql = mysql_query("SELECT * FROM accounts WHERE $type='$val'");
$num = mysql_num_rows($sql);

print $num;