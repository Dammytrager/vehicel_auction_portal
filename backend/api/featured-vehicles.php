<?php

require '../helpers/db_helpers.php';
require '../helpers/vehicle_helpers.php';

$featuredVehicles = $model->getFeaturedVehicles();

$data = processResult($featuredVehicles);

echo json_encode($data);
