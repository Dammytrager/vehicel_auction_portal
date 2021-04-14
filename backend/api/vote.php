<?php

require '../helpers/db_helpers.php';

$data = file_get_contents('php://input');
$data = json_decode($data);

// Verify Recaptcha Token
$url = "https://www.google.com/recaptcha/api/siteverify";
$postData = [
    'secret' => "6LfZpakaAAAAAEx7VUK9cAar33oAkNYOyD7uqwjD",
    'response' => $data->token ?? '',
    'remoteip' => $_SERVER['REMOTE_ADDR']
];
$options = [
    'http' => [
        'header' => 'Content-type: application/x-www-form-urlencoded\r\n',
        'method' => 'POST',
        'content' => http_build_query($postData)
    ]
];
$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

$response = json_decode($response);

if ($response->success === true) {

    $model->vote($data->id);

    $returnData = ["message" => "vote added"];

    echo json_encode($returnData);

}

else {
    header("HTTP/1.1 401 Unauthorized");
    echo json_encode(['message' => 'User not identified']);
}




