<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function create_con() {
    $dbhost = "localhost";
    $dbuser = "site";
    $dbpass = "pass";
    $dbname = "NEWTOWN";

    $con = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
    if (mysqli_connect_errno()) {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
        exit();
    }
    return $con;
}

function prepate_stmt($con, $sql) {
  $stmt = $con->prepare($sql);
  if(!$stmt) {
    die($con->error);
  }
  return $stmt;
}

function clean($con, $stmt) {
    $stmt->free_result();
    $stmt->close();
    $con->close();
}
