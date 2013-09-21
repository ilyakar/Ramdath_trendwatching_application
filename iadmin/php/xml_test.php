<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

$path = '/PATH/TO/ZEND/FRAMEWORK/';
set_include_path(get_include_path() . PATH_SEPARATOR . $path);

require_once('Zend/Loader/Autoloader.php');
Zend_Loader_Autoloader::getInstance();

$params = array(
    'username' => 'USERNAME-HERE',
    'password' => 'PASSWORD-GOES-HERE',
    'method' => 'add_post_meta',
    'args' => array(
        'post_id' => 1,
        'meta_key' => 'Michael',
        'meta_value' => 'Rocks',
        'unique' => false)
);

$client = new Zend_XmlRpc_Client('http://YOUR-WORDPRESS-URL/xmlrpc.php');
$response = $client->call('extapi'. ".callWpMethod",$params);
