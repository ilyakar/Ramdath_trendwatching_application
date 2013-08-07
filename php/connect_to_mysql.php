<?php

error_reporting(E_ERROR | E_WARNING | E_PARSE);

$db_host = '127.0.0.1:3306';
$db_user = 'root';
$db_pass = '';
$db_name = 'SOTT';

$con = mysql_connect( $db_host , $db_user , $db_pass);

if (!$con){
    print '<p>There is a problem connecting to the database<br /> we are aware of the problem and it will be fixed as soon as possible.</p>';

}

$con = mysql_select_db( $db_name );

if (!$con){
    print '<p>There is a problem connecting to the database (database cannot be selected)</p>';
}

?>