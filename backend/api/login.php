<?php

require '../helpers/db_helpers.php';

$data = file_get_contents('php://input');
$data = json_decode($data);

$response = $model->login($data);

if ($response) {
    echo json_encode([
      'id' => $response['id'],
      'username' => $response['username'],
      'is_admin' => $response['is_admin'],
      'is_ceo_cto' => $response['is_ceo_cto']
    ]);
} else {
    header("HTTP/1.1 401 Unauthorized");
    echo json_encode(['message' => 'invalid credential']);
}
