<?php

error_reporting(E_ERROR | E_WARNING | E_PARSE);

$db_host = '127.0.0.1:3306';
$db_user = 'root';
$db_pass = '';
$db_name = 'SOTT';

//$db_host = 'localhost';
//$db_user = 'sott_user';
//$db_pass = 'sott123';
//$db_name = 'sott';

//$db_host = '10.0.29.34:3306';
//$db_user = 'ucbKt1hE89PwA';
//$db_pass = 'prWK3KN82zf2p';
//$db_name = 'd81c41e5fc15f4bb59c6ea65d0dd6488b';

$con = mysql_connect( $db_host , $db_user , $db_pass);

if (!$con){
    print '<p>There is a problem connecting to the database<br /> we are aware of the problem and it will be fixed as soon as possible.</p>';

}

$con = mysql_select_db( $db_name );

if (!$con){
    print '<p>There is a problem connecting to the database (database cannot be selected)</p>';
}
?>