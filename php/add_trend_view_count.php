<?php

include 'connect_to_mysql.php';

$trend_id = $_POST['trend_id'];

$sql = mysql_query("SELECT * FROM trends WHERE id='$trend_id'");
while($row = mysql_fetch_array($sql)){
    $views = $row['views'];
}

if(!$views){
    $views = 0;
}

$views++;

mysql_query("UPDATE trends SET views='$views' WHERE id='$trend_id'");