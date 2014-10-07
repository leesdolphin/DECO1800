<?php

$dbhost = "localhost";
$dbuser = "site";
$dbpass = "pass";
$dbname = "TOWN";

$con = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit();
}

/* 
$result = mysqli_query($con,'SELECT TownName FROM TOWNPOP WHERE TownName="'. $_GET[0].'%"');

  while($row = mysqli_fetch_array($result)) {
  echo 'I have no idea what I am doing!!!!!';
  // I have no idea what I am doing!!!!!
  }
 */
/**
 * This prepares a statement.
 * Then binds the values.
 * Executes it
 * Then binds the `TownName` value(from the database) for each row to `$townName`
 */
$stmt = $con->prepare("SELECT TownName FROM TOWNPOP WHERE TownName LIKE ? ORDER BY TownName ASC LIMIT 6") or die($con->error);
$term = $_GET["term"] . '%';
$stmt->bind_param("s", $term) or die($con->error);
$stmt->execute();
$stmt->bind_result($townName);

// Set the content type.
header('Content-Type: application/json');

echo '[';
if($stmt->fetch()) {
    /**
     * There are results; the first one is now in `$townName
     */
    echo json_encode($townName);
    while ($stmt->fetch()) {
        /**
         * Now do the rest of them
         */
        echo ", " . json_encode($townName);
    }
}
echo "]";

/**
 * Now clean up our mess and close the connection.
 */
$stmt->free_result();
$stmt->close();
$con->close();

?>
