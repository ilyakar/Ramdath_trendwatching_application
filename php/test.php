<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
ini_set('memory_limit', '-1');
error_reporting(-1);

include '../php/php_includes.php';

if(isset($_POST['submit'])){
    $file = $_FILES['file'];
    $file = new SimpleImage($file['tmp_name']);
    $file->fit_to_width(300);
    $file->save('../uploads/image.jpg');
//    move_uploaded_file($file['tmp_name'], '../uploads/image.jpg');
    print 'done';
}

?>
<form method="post" enctype="multipart/form-data">
    <input type="file" name="file">
    <input type="submit" name="submit">
</form>
