<?php

include '../../php/php_includes.php';

$account_id = $_POST['account_id'];

mysql_query("INSERT INTO accounts_trash SELECT * FROM accounts WHERE id='$account_id'") or die(mysql_error());

mysql_query("DELETE FROM accounts WHERE id='$account_id'") or die(mysql_error());