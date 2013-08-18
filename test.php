<?php

include 'php/connect_to_mysql.php';

$sql = mysql_query("SELECT * FROM trends");
while($row = mysql_fetch_array($sql)){
    print $row['title'].'<br>';
}