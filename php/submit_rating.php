<?php

include 'php_includes.php';

$trend_id           = $_POST['trend_id'];
$user_id            = $_POST['user_id'];
$score_cool         = $_POST['score_cool'];
$score_potential    = $_POST['score_potential'];

$votes              = 0;
$user_ids           = null;
$score_cool_db      = 0;
$score_potential_db = 0;

$sql = mysql_query("SELECT * FROM rater WHERE trend_id='$trend_id'");
if(mysql_num_rows($sql) > 0){
    $row_exists = 1;
}
else {
    $row_exists = 0;
}

if($row_exists){
    while($row = mysql_fetch_array($sql)) {
        $votes              = $row['votes'];
        $user_ids           = $row['user_ids'];
        $score_cool_db      = $row['score_cool'];
        $score_potential_db = $row['score_potential'];
    }
}

$new_score_cool         = $score_cool_db + $score_cool;
$new_score_potential    = $score_potential_db + $score_potential;

$votes++;

if($user_ids)   $user_ids = $user_ids.','.$user_id;
else            $user_ids = $user_id;

if(!$row_exists){
    mysql_query("INSERT INTO rater (trend_id) VALUES ('$trend_id')");
}

mysql_query("UPDATE rater SET score_cool='$new_score_cool', score_potential='$new_score_potential', votes='$votes', user_ids='$user_ids' WHERE trend_id='$trend_id'");

$json                       = '';
$json['score_cool']         = $new_score_cool;
$json['score_potential']    = $new_score_potential;
$json['votes']              = $votes;

print json_encode($json);