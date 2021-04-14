<?php

require '../helpers/db_helpers.php';
require '../helpers/vehicle_helpers.php';

$users = $model->getRegisteredUsers();

echo json_encode($users);
