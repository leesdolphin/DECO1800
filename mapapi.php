<?php
include './include/req_helper.php';

$dbhost = "localhost";
$dbuser = "site";
$dbpass = "pass";
$dbname = "TOWN";

$con = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
//$con=mysqli_connect("example.com","peter","abc123","my_db");
// Check connection
if (mysqli_connect_errno()) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$result = mysqli_query($con,"SELECT TownName FROM TOWNPOP LIMIT 4");
$num = 0;

header('Content-Type: application/json');
echo '{"Towns": [';
while($row = mysqli_fetch_array($result)) {
	if ($num == 0) {
		echo '{"Townname": "' . $row['TownName'] . '"}';
		$num = 1;
	}
	else {
		echo ', ';
		echo '{"Townname": "' . $row['TownName'] . '"}';
	}
	/* $url = 'https://maps.googleapis.com/maps/api/geocode/json?address='. $row['TownName'] .'&reigon=au';
	$json = file_get_contents($url);
	echo $json; */
}
echo "]}";

mysqli_close($con);