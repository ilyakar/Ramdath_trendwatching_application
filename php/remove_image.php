<?php

$file = $_POST['file'];

$path = '../uploads/';

unlink($path .'/'. $file);

?>