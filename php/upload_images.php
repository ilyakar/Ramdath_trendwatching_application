<?php

include 'connect_to_mysql.php';

if (!empty($_FILES)) {

    $cnt = 0;
    foreach ($_FILES['file']['name'] as $filename)
    {

        // Get tmp name
        $file_temp_name  = $_FILES['file']['tmp_name'][$cnt];
        $file_name       = $_FILES['file']['name'][$cnt];

        // Image upload path (with image name)
        $target_path    = '../uploads/' . $file_name;

        // Upload
        move_uploaded_file($file_temp_name, $target_path);

        $cnt++;

    }

}