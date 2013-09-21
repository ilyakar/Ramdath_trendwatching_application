<?php

include 'php_includes.php';

if (!empty($_FILES)) {

    $cnt = 0;
//    foreach ($_FILES['file']['name'] as $filename)
//    {

        // Dir
        $dir = '../uploads/';

        // Get image
        $file = WideImage::load($_FILES['file']['tmp_name']); // gets from the upload field

        // Manipulate image
        $file = $file->resize(800);

        // Get image name
        $file_name = $_FILES['file']['name'];

        // Adjust image name
        $file_name = urldecode($file_name);
        $file_name = str_replace(' ', '-', $file_name);
        $file_name = urlencode($file_name);

        // Get extension
        $extension = pathinfo($dir.$file_name, PATHINFO_EXTENSION);

        // Image without extension
        $file_name = explode('.', $file_name);
        $file_name = $file_name[0];

        // Check if image with that name already exists (if so, rename this one a bit)
        // Get image name without extension
        $files            = glob($dir.$file_name .'*');
        $num              = count($files);
        if($num > 0){
            $file_name = $file_name .'['. ($num+1) .']';
        }

        // Image path with correct extension
        $file_path = $dir.$file_name .'.'. $extension;

        // Upload
        $file->saveToFile($file_path);

        $cnt++;

//    }

}

?>

<form method="post" enctype="multipart/form-data">
    <input type="file" name="file" />
    <input type="submit" />
</form>