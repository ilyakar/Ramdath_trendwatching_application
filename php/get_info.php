<?php

include 'php_includes.php';

$sql = mysql_query("SELECT * FROM trends");
while($row = mysql_fetch_array($sql)) {

    // Decodes all the encoded info
    $row['title']       = urldecode($row['title']);
    $row['description'] = urldecode($row['description']);
    $row['tags']        = urldecode($row['tags']);
    $row['categories']  = urldecode($row['categories']);
    $row['location']    = urldecode($row['location']);
    // --

    $rows['trends'][] = $row;
}

$sql = mysql_query("SELECT * FROM rater");
while($row = mysql_fetch_array($sql)) {
    $rows['rater'][] = $row;
}

$sql = mysql_query("SELECT * FROM categories");
while($row = mysql_fetch_array($sql)) {
    $rows['categories'][] = $row;
}

print json_encode($rows);

?>