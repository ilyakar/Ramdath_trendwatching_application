<?php

include '../../php/php_includes.php';

$workspaces     = $_POST['workspaces'];
$categories     = $_POST['categories'];
$ment_trends    = $_POST['ment_trends'];


// Categories

$workspaces = explode(',', $workspaces);
$sql = mysql_query("SELECT * FROM research_projects");
while($row = mysql_fetch_array($sql)){
    $workspaces_db[] = $row['name'];
}

$to_add = array_diff($workspaces, $workspaces_db);
$to_del = array_diff($workspaces_db, $workspaces);

// Add categories
foreach($to_add as $workspace){
    mysql_query("INSERT INTO research_projects (name) VALUES ('$workspace')") or die(mysql_error());
}

// Delete categories
foreach($to_del as $category){
    mysql_query("DELETE FROM research_projects WHERE name='$workspace'") or die(mysql_error());
}


// If added a workspace, order it
if(json_encode($to_add)){
    for($i=0; $i<count($workspaces); $i++){

        $workspace = $workspaces[$i];
        $order = $i+1;

        print 'order: '.$order.', category: '.$category.'<br>';

        mysql_query("UPDATE research_projects SET order_id='$order' WHERE name='$workspace'") or die(mysql_error());

    }
}

// Categories

    $categories = explode(',', $categories);
    $sql = mysql_query("SELECT * FROM categories");
    while($row = mysql_fetch_array($sql)){
        $categories_db[] = $row['name'];
    }

    $to_add = array_diff($categories, $categories_db);
    $to_del = array_diff($categories_db, $categories);

    // Add categories
    foreach($to_add as $category){
        mysql_query("INSERT INTO categories (name) VALUES ('$category')") or die(mysql_error());
    }

    // Delete categories
    foreach($to_del as $category){
        mysql_query("DELETE FROM categories WHERE name='$category'") or die(mysql_error());
    }


    // If added a category, order it
    if(json_encode($to_add)){
        for($i=0; $i<count($categories); $i++){

            $category = $categories[$i];
            $order = $i+1;

            print 'order: '.$order.', category: '.$category.'<br>';

            mysql_query("UPDATE categories SET order_id='$order' WHERE name='$category'") or die(mysql_error());

        }
    }

// Mentality trends

    $ment_trends = explode(',', $ment_trends);
    $sql = mysql_query("SELECT * FROM mentality_trends");
    while($row = mysql_fetch_array($sql)){
        $ment_trends_db[] = $row['name'];
    }

    $to_add = array_diff($ment_trends, $ment_trends_db);
    $to_del = array_diff($ment_trends_db, $ment_trends);

    // Add ment trend
    foreach($to_add as $ment_trend){
        mysql_query("INSERT INTO mentality_trends (name) VALUES ('$ment_trend')") or die(mysql_error());
    }

    // Delete ment trend
    foreach($to_del as $ment_trend){
        mysql_query("DELETE FROM mentality_trends WHERE name='$ment_trend'") or die(mysql_error());
    }


    // If added a ment trend, order it
    if(json_encode($to_add)){
        for($i=0; $i<count($ment_trends); $i++){

            $ment_trend = $ment_trends[$i];
            $order = $i+1;

            print 'order: '.$order.', category: '.$category.'<br>';

            mysql_query("UPDATE mentality_trends SET order_id='$order' WHERE name='$ment_trend'") or die(mysql_error());

        }
    }