<?php

include 'php_includes.php';

$username   = $_POST['username'];
$password   = $_POST['password'];

// Clean for MySQL
$username   = mysql_real_escape_string($username);
$password   = mysql_real_escape_string($password);

// Encrypt the password

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

// Gets the project IDs
    $sql = mysql_query("SELECT * FROM accounts WHERE username='$username' AND password='$password'");
    while($row = mysql_fetch_array($sql)) {
        $rows['user_info'] = $row;

        $project_ids = $row['project_ids']; // used to get the research projects
    }

    if($project_ids){
        $where = "id='" . str_replace(',', "' OR id='", $project_ids) . "'";

        $sql = mysql_query("SELECT * FROM research_projects WHERE $where");
        while($row = mysql_fetch_array($sql)) {
            $rows['research_projects'][] = $row;
        }
    }

print json_encode($rows);

?>