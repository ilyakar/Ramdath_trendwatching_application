<?php

include 'php_includes.php';

$trend_id           = $_POST['trend_id'];

$title              = urlencode($_POST['title']);
$description        = urlencode($_POST['description']);
$video              = urlencode($_POST['video']);
$website            = urlencode($_POST['website']);
$location           = urlencode($_POST['location']);

$tags               = urlencode($_POST['tags']);
$categories         = urlencode($_POST['categories']);
$ment_trend         = urlencode($_POST['ment_trend']);

// Update trend info
mysql_query("UPDATE trends SET

title='$title',
description='$description',
video='$video',
website='$website',
location='$location',

tags='$tags',
categories='$categories',
ment_trend='$ment_trend'

WHERE id='$trend_id'") or die(mysql_error());