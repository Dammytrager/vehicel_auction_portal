<?php

require '../helpers/db_helpers.php';
require '../helpers/vehicle_helpers.php';

$activeVehicles = $model->getActiveVehicles();

$data = processResult($activeVehicles);

echo json_encode($data);
