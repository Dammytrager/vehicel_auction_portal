<?php

require '../helpers/db_helpers.php';
require '../helpers/vehicle_helpers.php';

$bids = $model->getBids();

echo json_encode($bids);
