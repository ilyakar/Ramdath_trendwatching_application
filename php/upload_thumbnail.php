<?php

$output_dir = "../uploads/";


if(isset($_FILES["profile_image"]))
{
    move_uploaded_file($_FILES["profile_image"]["tmp_name"], $output_dir. $_FILES["profile_image"]["name"]);

    echo "Uploaded File :".$_FILES["profile_image"]["name"];
}
else {
    print 'no';
}