<?php

function buildUrl($base, $urlParams) {
    $r = $base . '?';
    foreach ($urlParams as $k => $v) {
        $r .= rawurlencode(strval($k)) . "=" . rawurlencode(strval($v)) . "&";
    }
    return substr($r, 0, -1); // Remove the last '&' from the url
}

function doRequest($url) {
    $http = curl_init($url);
    curl_setopt($http, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($http, CURLOPT_HEADER, FALSE);
    
    $body = curl_exec($http);
    $http_status = curl_getinfo($http, CURLINFO_HTTP_CODE);
    
    curl_close($http);
    
    return ['body'   => $body,
            'status' => intval($http_status)];
}
