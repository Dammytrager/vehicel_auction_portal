<?php

require '../helpers/db_helpers.php';
require '../helpers/vehicle_helpers.php';

$vehicles = $model->getAllVehicles();

//$featuredVehicles = $model->getFeaturedVehicles();

//$processedVehiclesData = processResult($vehicles);

$data = processResult($vehicles);

echo json_encode($data);

//
//function soldOutVehicles($vehicles)
//{
//    $arr = [];
//
//    foreach ($vehicles as $vehicle) {
//        if ($vehicle['count'] === 0) $arr[] = $vehicle;
//    }
//
//    return $arr;
//}
//
//function activeVehicles($vehicles)
//{
//    $arr = [];
//
//    foreach ($vehicles as $vehicle) {
//        if ($vehicle['count'] > 0) $arr[] = $vehicle;
//    }
//
//    return $arr;
//}
