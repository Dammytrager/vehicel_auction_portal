<?php

require '../helpers/db_helpers.php';
require '../helpers/vehicle_helpers.php';

$activeVehicles = $model->getSoldOutVehicles();

$data = processResult($activeVehicles);

echo json_encode($data);
