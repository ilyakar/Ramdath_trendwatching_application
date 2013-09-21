<?php

include 'php_includes.php';

$trend_id           = $_POST['trend_id'];

$premium            =           $_POST['premium']; // Used in iadmin
$title              = urlencode($_POST['title']);
$description        = urlencode($_POST['description']);
$videos             = urlencode($_POST['videos']);
$website            = urlencode($_POST['website']);
$location           = urlencode($_POST['location']);

$tags               = urlencode($_POST['tags']);
$categories         = urlencode($_POST['categories']);
$workspace          =           $_POST['workspace'];
$ment_trend         = urlencode($_POST['ment_trend']);

if(!$premium){
    $premium = 0;
}

// Update trend info
mysql_query("UPDATE trends SET

premium='$premium',
title='$title',
description='$description',
videos='$videos',
website='$website',
location='$location',

tags='$tags',
categories='$categories',
research_project='$workspace',
ment_trend='$ment_trend'

WHERE id='$trend_id'") or die(mysql_error());