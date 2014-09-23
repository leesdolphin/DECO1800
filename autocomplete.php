<?php

$dbhost = "localhost";
$dbuser = "site";
$dbpass = "pass";
$dbname = "TOWN";
	
$con = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
if (mysqli_connect_errno()) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$result = mysqli_query($con,'SELECT TownName FROM TOWNPOP WHERE TownName="'. $_GET[0].'%"');

while($row = mysqli_fetch_array($result)) {
    echo 'I have no idea what I am doing!!!!!';
    // I have no idea what I am doing!!!!!
}

mysqli_close($con);
?>
