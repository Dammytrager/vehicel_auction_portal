<?php

require '../helpers/db_helpers.php';

$data = file_get_contents('php://input');
$data = json_decode($data);

$data->id = $model->addComment($data);
$data->created_at = date('Y-m-d H:i:s');

echo json_encode($data);



