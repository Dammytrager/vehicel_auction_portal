<?php

require '../helpers/db_helpers.php';

$data = file_get_contents('php://input');
$data = json_decode($data);

$result = $model->createUser($data);

if (!$result) {
    header("HTTP/1.1 400 Bad Request");
    echo json_encode(['message' => 'User Exists']);
} else {
    echo json_encode(['message' => 'Admin Created']);
}




