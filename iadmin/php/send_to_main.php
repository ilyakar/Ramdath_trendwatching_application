<?php

include '../../php/php_includes.php';
include('IXR_Library.php');

$trend_id = $_POST['trend_id'];

$sql = mysql_query("SELECT * FROM trends WHERE id='$trend_id'");
while($row = mysql_fetch_array($sql)){

    // Decodes all the encoded info
    $row['title']       = urldecode($row['title']);
    $row['description'] = urldecode($row['description']);
    $row['tags']        = urldecode($row['tags']);
    $row['categories']  = urldecode($row['categories']);
    $row['location']    = urldecode($row['location']);
    $row['videos']      = urldecode($row['videos']);
    $row['website']     = urldecode($row['website']);
    $row['ment_trend']  = urldecode($row['ment_trend']);
    // --

    $rows['trend'] = $row;
}

$user_id = $rows['trend']['user_id'];
$sql = mysql_query("SELECT * FROM accounts WHERE id='$user_id'");
while($row = mysql_fetch_array($sql)){

    $rows['user_info'] = $row;

}


// ---------------------- Da wp ------------------------

// Setup
    function send($type, $params){

        // --- Setup ---
        $client     = new IXR_Client('http://scienceofthetime.com/xmlrpc.php');
        $username   = 'coolhunter01';
        $password   = 'coolhunt';

        $client->debug = false;
        // -------------

        $client->query($type, '', $username, $password, $params, true);

        return $client->getResponse();

    }

// If new user
if(!is_numeric($rows['user_info']['wp_site_id'])){

    // New user (will simply do nothing if user already exists)
    $wp_site_user_id = send(
            'wp.newUser',
            array(
                'username'  => $rows['user_info']['username'],
                'first_name'=> $rows['user_info']['first_name'],
                'last_name' => $rows['user_info']['last_name'],
                'password'  => $rows['user_info']['password'],
                'email'     => $rows['user_info']['email']
            )
        );

    // If new account
    if(is_numeric($wp_site_user_id)){

        print 'new account';
        mysql_query("UPDATE accounts SET wp_site_id='$wp_site_user_id' WHERE id='$user_id'") or die(mysql_error());

    }
    else {
        print 'some kind of error';
    }

}
else {
    $wp_site_user_id = $rows['user_info']['wp_site_id'];
}

// Post upload

$post_id = send(

    'metaWeblog.newPost',
    array(
        'title'         => $rows['trend']['title'],
        'description'   => $rows['trend']['description'],
        'categories'    => explode(',', $rows['trend']['categories']),
        'tags'          => explode(',', $rows['trend']['tags']),
        'wp_author_id'  => $wp_site_user_id
    )

);

// Image upload stuff
    $images = explode(',', $rows['trend']['images']);

    $num = count($images);

    for($i=0; $i<$num; $i++){

        $image = $images[$i];
        $file = '../../images/'. $image;

        if(file_exists($file)){
            $fh = fopen($file, 'r');
            $fs = filesize($file);
            $data = fread($fh, $fs);
            fclose($fh);

            send(
                'wp.uploadFile',
                array(
                    'name'      => $image,
                    'type'      => 'image/jpg',
                    'bits'      => new IXR_Base64($data),
                    'overwrite' => false,
                    'post_id'   => $post_id
                )
            );
        }

    }

// ----------------------------------------------------

// Sets that the trend is sent
mysql_query("UPDATE trends SET on_main='1' WHERE id='$trend_id'") or die(mysql_error());
