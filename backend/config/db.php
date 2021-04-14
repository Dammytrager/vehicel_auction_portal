<?php
$host = "127.0.0.1";
$db   = 'vehicle_auction';
$user = 'root';
$pass = '';
$port = "3306";

global $pdo;

$options = [
    \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
    \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
    \PDO::ATTR_EMULATE_PREPARES   => false,
];
$dsn = "mysql:host=$host;dbname=$db;port=$port";

try {

    $pdo = new \PDO($dsn, $user, $pass, $options);

} catch (\PDOException $e) {

    throw new \PDOException($e->getMessage(), (int)$e->getCode());

}
