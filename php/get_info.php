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

    $row['num_comments'] = 0;

    $id = $row['id'];

    $sql2 = mysql_query("SELECT * FROM comments WHERE trend_id='$id'");
    while($row2 = mysql_fetch_array($sql2)){

        $row['num_comments'] = mysql_num_rows($sql2);

    }

    $sql2 = mysql_query("SELECT * FROM rater WHERE trend_id='$id'");
    while($row2 = mysql_fetch_array($sql2)) {
        $row['rating']['value']    = $row2['value'];
        $row['rating']['votes']    = $row2['votes'];
        $row['rating']['user_ids'] = $row2['user_ids'];
    }

    $rows['trends'][] = $row;
}

$sql = mysql_query("SELECT * FROM categories");
while($row = mysql_fetch_array($sql)) {
    $rows['categories'][] = $row;
}

print json_encode($rows);

?>