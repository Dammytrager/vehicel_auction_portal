<?php

function processResult($vehicles, $featured = false)
{
    $tmp = [];

    foreach($vehicles as $key => $vehicle)
    {
        $tmp[$vehicle['id']][] = $vehicle;
    }

    $output = [];

    foreach ($tmp as $vehicleArr) {

        $comments = [];

        foreach ($vehicleArr as $vehicle) {
            if ($vehicle['comments']) {
                $comments[] = $vehicle['comments'];
            }
        }

        $baseVehicle = $vehicleArr[0];
        $baseVehicle['comments'] = $comments;

        $output[] = $baseVehicle;

    }

    return $featured ? array_slice($output, 0, 5, true) : $output;
};
