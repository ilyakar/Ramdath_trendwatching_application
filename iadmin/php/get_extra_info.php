<?php

include '../../php/php_includes.php';

$sql = mysql_query("SELECT * FROM research_projects");
while($row = mysql_fetch_array($sql)) {
    $rows['research_projects'][] = $row;
}
$sql = mysql_query("SELECT * FROM accounts");
while($row = mysql_fetch_array($sql)) {
    $rows['accounts'][] = $row;
}


print json_encode($rows);