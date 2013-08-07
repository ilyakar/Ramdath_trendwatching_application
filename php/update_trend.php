<?php

include 'php_includes.php';

$trend_id           = $_POST['trend_id'];

$title              = urlencode($_POST['title']);
$description        = urlencode($_POST['description']);
$tags               = urlencode($_POST['tags']);
$categories         = urlencode($_POST['categories']);
$location           = urlencode($_POST['location']);

$description        = nl2p($description);

// Update trend info
mysql_query("UPDATE trends SET title='$title', description='$description', tags='$tags', categories='$categories', location='$location' WHERE id='$trend_id'") or die(mysql_error());

?>