<?php

include '../../php/php_includes.php';

$sql = mysql_query("SELECT * FROM research_projects ORDER BY order_id");
while($row = mysql_fetch_array($sql)) {
    $rows['research_projects'][] = $row;
}
$sql = mysql_query("SELECT * FROM accounts");
while($row = mysql_fetch_array($sql)) {
    $rows['accounts'][] = $row;
}
$sql = mysql_query("SELECT * FROM privilages");
while($row = mysql_fetch_array($sql)) {
    $rows['privilages'][] = $row;
}


print json_encode($rows);