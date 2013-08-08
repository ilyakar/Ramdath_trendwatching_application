<?php
//
include '../php/connect_to_mysql.php';


//mysql_query("ALTER TABLE `SOTT`.`accounts` ADD COLUMN `asda` VARCHAR(45) NULL ;");

$file = file_get_contents('dumps.csv');

$lines = explode("\n", $file);

$column_array = [];

for($i=0; $i<count($lines); $i++){

    $line       = $lines[$i];
    $columns    = explode(',', $line);

    $num = $i;
print '<p>';
    for($b=0; $b<count($columns); $b++){

        $column = $columns[$b];
        $column = str_replace('"', '', $column);

        if($b<78 && $b>0){


            if($i == 0){ // Put columns in database

//                mysql_query("ALTER TABLE `SOTT`.`accounts_new4` ADD COLUMN `$column` VARCHAR(45) NULL");
                $column_array[$b] = $column;

            }
            else { // Update accounts

//                mysql_query("INSERT INTO `SOTT`.`accounts_new4` (`ID`) VALUES ('$num')");
//                mysql_query("UPDATE `SOTT`.`accounts_new2` SET '$column_array[$b]'='$column' WHERE `id`='$num'");
//                $test = 'user_login';
                mysql_query("UPDATE `SOTT`.`accounts_new4` SET `$column_array[$b]`='$column' WHERE `id`='$num'");

            }


        }
    }
    print '</p>';

//    if($i == 0){
//
//        // Table names
//
//    }

}

?>