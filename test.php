<?php

include 'php/connect_to_mysql.php';

mysql_query("UPDATE categories SET order_id='1' WHERE name='1'") or die(mysql_error());