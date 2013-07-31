<?php

include 'php_includes.php';

$trend_id = $_POST['trend_id'];

$rows = [];

$sql = mysql_query("SELECT * FROM comments WHERE trend_id='$trend_id'");
while($row = mysql_fetch_array($sql)) {

    $row['comment'] = urldecode($row['comment']);

    $rows['comments'][] = $row;
    $author_id = $row['author_id'];

    // Gets the author info
    $sql2 = mysql_query("SELECT * FROM accounts WHERE id='$author_id'");
    while($row2 = mysql_fetch_array($sql2)) {
        $rows['authors'][] = $row2;
    }
}

print json_encode($rows);

?>