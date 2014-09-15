<?php
include './include/req_helper.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: text/json");

$apiKey = "3ouv1kt7m3bdlqan";

// Setup defaults.
$params = ["reclevel" => "full",
           "rectype" => "work",
           "include" => ""];

foreach ($_GET as $k => $v) {
    $params[$k] = $v;
}

// Now define overrides.
$params["key"] = $apiKey;
$params["encoding"] = "json";

$record_type = $params["rectype"];
unset($params["rectype"]);
$id = $params["id"];
unset($params["id"]);

if($record_type == "newspaper") {
    $params["include"] .= ",articletext";
}



$resp = doRequest(buildUrl("http://api.trove.nla.gov.au/$record_type/$id", $params));

if($resp["status"] != 200) {
    http_response_code($resp["status"]); // This may change to be a 200 response if necissary
    echo "{'error': 1, 'status': " . $resp["status"] . ", 'body': '" . json_encode($resp["body"]) . "'}";
    exit();
} else {
    echo $resp["body"];
    exit();
}