<?php

include 'php_includes.php';

$project_ids   = $_POST['project_ids'];

// Gets the research_projects
$where = "id='" . str_replace(',', "' OR id='", $project_ids) . "'";

$sql = mysql_query("SELECT * FROM research_projects WHERE $where");
while($row = mysql_fetch_array($sql)) {
    $rows['research_projects'][] = $row;
}

print json_encode($rows);

?>