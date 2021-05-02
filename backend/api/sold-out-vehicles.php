<?php

require '../helpers/db_helpers.php';
require '../helpers/vehicle_helpers.php';

$activeVehicles = $model->getSoldOutVehicles(); // Get sold out vehicles

$data = processResult($activeVehicles); // Present in a good format

echo json_encode($data);
