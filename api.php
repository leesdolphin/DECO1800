<?php
include './include/req_helper.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: text/json");

$apiKey = "3ouv1kt7m3bdlqan";

$params = ["reclevel" => "brief",
           "n" => 20,
           "sortby" => "dateasc"];

foreach ($_GET as $k => $v) {
    $params[$k] = $v;
}
$params["key"] = $apiKey;
$params["encoding"] = "json";


$resp = doRequest(buildUrl("http://api.trove.nla.gov.au/result", $params));

if($resp["status"] != 200) {
    http_response_code($resp["status"]); // This may change to be a 200 response if necissary
    echo "{'error': 1, 'status': " . $resp["status"] . ", 'body': '" . json_encode($resp["body"]) . "'}";
    exit();
} else {
    echo $resp["body"];
    exit();
}