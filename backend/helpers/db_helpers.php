<?php

require '../config/db.php';

/**
 * Responsible for fetching and storing items in the database
 * Class DB
 */
class DB
{

    public $connection;

    public function __construct($connection)
    {

        $this->connection = $connection;

    }


    /**
     * Get all vehicles from the database with respective comments
     * @return array
     */
    public function getAllVehicles()
    {

        $vehicles = [];

        $query = "SELECT `vehicles`.`id` AS id,
                        `comments`.`comment` AS comments,
                        `vehicles`.`name` as name,
                        `vehicles`.`img_url` as img_url,
                        `vehicles`.`votes` as votes,
                        `vehicles`.`user_id` as user_id,
                        `vehicles`.`sold_out` as sold_out,
                        `vehicles`.`created_at` AS created_at
                    FROM vehicles
                    LEFT JOIN comments
                    ON vehicles.id = comments.vehicle_id
                    ORDER BY id DESC";

        $data = $this->connection->query($query);

        while ($row = $data->fetch(PDO::FETCH_ASSOC)) {
            $vehicles[] = $row;
        }

        return $vehicles;
    }


    /**
     * Gets the featured vehicles - Vehicles from the previous week
     * @return array
     */
    public function getFeaturedVehicles()
    {

        $vehicles = [];

        $query = "SELECT `vehicles`.`id` AS id,
                        `comments`.`comment` AS comments,
                        `vehicles`.`name` as name,
                        `vehicles`.`img_url` as img_url,
                        `vehicles`.`votes` as votes,
                        `vehicles`.`created_at` AS created_at
                    FROM vehicles
                    LEFT JOIN comments
                    ON vehicles.id = comments.vehicle_id
                    WHERE YEARWEEK(`vehicles`.`created_at`) = YEARWEEK(NOW() - INTERVAL 1 WEEK)
                    ORDER BY vehicles.votes DESC";

        $data = $this->connection->query($query);

        while ($row = $data->fetch(PDO::FETCH_ASSOC)) {
            $vehicles[] = $row;
        }

        return $vehicles;
    }


    /**
     * Get active vehicles - Vehicles from the present week
     * @return array
     */
    public function getActiveVehicles()
    {

        $vehicles = [];

        $query = "SELECT `vehicles`.`id` AS id,
                        `comments`.`comment` AS comments,
                        `vehicles`.`name` as name,
                        `vehicles`.`img_url` as img_url,
                        `vehicles`.`votes` as votes,
                        `vehicles`.`created_at` AS created_at
                    FROM vehicles
                    LEFT JOIN comments
                    ON vehicles.id = comments.vehicle_id
                    WHERE YEARWEEK(`vehicles`.`created_at`) = YEARWEEK(NOW())
                    ORDER BY vehicles.votes DESC";

        $data = $this->connection->query($query);

        while ($row = $data->fetch(PDO::FETCH_ASSOC)) {
            $vehicles[] = $row;
        }

        return $vehicles;
    }


    /**
     * Get sold out vehicles
     * @return array
     */
    public function getSoldOutVehicles()
    {

        $vehicles = [];

        $query = "SELECT `vehicles`.`id` AS id,
                        `comments`.`comment` AS comments,
                        `vehicles`.`name` as name,
                        `users`.`username` as username,
                        `vehicles`.`img_url` as img_url,
                        `vehicles`.`votes` as votes,
                        `vehicles`.`created_at` AS created_at
                    FROM vehicles
                    LEFT JOIN comments
                    ON vehicles.id = comments.vehicle_id
                    LEFT JOIN users
                    on vehicles.user_id = users.id
                    WHERE user_id is NOT NULL
                    ORDER BY vehicles.votes DESC";

        $data = $this->connection->query($query);

        while ($row = $data->fetch(PDO::FETCH_ASSOC)) {
            $vehicles[] = $row;
        }

        return $vehicles;
    }


    /**
     * Get all bids with their respective users
     * @return array
     */
    public function getBids()
    {

        $bids = [];

        $query = "SELECT `bids`.`id` AS id,
                        `bids`.`amount` AS amount,
                        `vehicles`.`name` as name,
                        `users`.`username` as username,
                        `bids`.`created_at` as created_at
                    FROM bids
                    LEFT JOIN vehicles
                    ON vehicles.id = bids.vehicle_id
                    LEFT JOIN users
                    on bids.user_id = users.id
                    ORDER BY bids.created_at DESC";

        $data = $this->connection->query($query);

        while ($row = $data->fetch(PDO::FETCH_ASSOC)) {
            $bids[] = $row;
        }

        return $bids;
    }


    /**
     * Add a vehicle
     * @param $data
     * @return mixed
     */
    public function addVehicle($data)
    {
        $query = "INSERT INTO vehicles (`name`, `img_url`, `created_at`) VALUES ('$data->name', '$data->img_url', NOW())";

        $data = $this->connection->query($query);

        return $this->connection->lastInsertId();
    }


    /**
     * Vote on a vehicle - increase vehicle vote by 1
     * @param $id
     * @return bool
     */
    public function vote($id)
    {
        $query = "UPDATE vehicles SET votes = votes + 1 WHERE id = '$id'";

        $data = $this->connection->query($query);

        return true;
    }


    /**
     * Bid on a vehicle
     * @param $data
     * @return bool
     */
    public function bid($data)
    {
        $query = "INSERT INTO
                    bids (`user_id`, `vehicle_id`, `amount`, `created_at`)
                    VALUES ('$data->user_id', '$data->vehicle_id', '$data->amount', NOW())";

        $data = $this->connection->query($query);

        return true;
    }


    /**
     * Comment on a vehicle
     * @param $data
     * @return mixed
     */
    public function addComment($data)
    {
        $query = "INSERT INTO comments (`vehicle_id`, `comment`, `created_at`) VALUES ('$data->id', '$data->comment', NOW())";

        $data = $this->connection->query($query);

        return $this->connection->lastInsertId();
    }

    /**
     * Create a new user
     * @param $data
     * @return false
     */
    public function createUser($data)
    {
        $query = "SELECT * FROM users WHERE username = '$data->username' LIMIT 1";

        $result = $this->connection->query($query);

        $row = $result->fetch();

        if ($row && count($row)) {
            return false;
        }

        $isAdmin = $data->is_admin ?? 0;
        $isCeoCto = $data->is_ceo_cto ?? 0;

        $password = password_hash("$data->password", PASSWORD_DEFAULT);

        $query = "INSERT INTO users (`username`, `password`, `is_admin`, `is_ceo_cto`) VALUES ('$data->username', '$password', $isAdmin, $isCeoCto)";

        $data = $this->connection->query($query);

        return $this->connection->lastInsertId();
    }


    /**
     * Authenticate a user - fetch the user in the db
     * @param $creds
     * @return false|array
     */
    public function login($creds)
    {
        $query = "SELECT id, username, password, is_admin, is_ceo_cto FROM users where username = '$creds->username'";

        $data = $this->connection->query($query);

        $row = $data->fetch();

        if (!$row || !count($row) || !password_verify($creds->password, $row['password'])) {
            return false;
        }

        return $row;
    }

    /**
     * Get the list of all registered users
     * @return array
     */
    public function getRegisteredUsers()
    {
        $users = [];

        $query = "SELECT username FROM users where is_admin = 0 AND is_ceo_cto = 0";

        $data = $this->connection->query($query);

        while ($row = $data->fetch(PDO::FETCH_ASSOC)) {
            $users[] = $row;
        }

        return $users;
    }


    /**
     * Get the list of all admin users
     * @return array
     */
    public function getAdminUsers()
    {
        $users = [];

        $query = "SELECT username FROM users where is_admin = 1 OR is_ceo_cto = 1";

        $data = $this->connection->query($query);

        while ($row = $data->fetch(PDO::FETCH_ASSOC)) {
            $users[] = $row;
        }

        return $users;
    }


    /**
     * Assign a car to the highest bidder
     * @return bool
     */
    public function setBid()
    {
        $vehicles = [];

        $query = "SELECT `vehicles`.`id` AS id,
                        `vehicles`.`user_id` AS winner,
                        `bids`.`user_id` AS user_id,
                        `bids`.`amount` as amount,
                        `vehicles`.`created_at` AS created_at
                    FROM vehicles
                    LEFT JOIN bids
                    ON vehicles.id = bids.vehicle_id
                    WHERE YEARWEEK(`vehicles`.`created_at`) = YEARWEEK(NOW() - INTERVAL 2 WEEK)
                    ORDER BY vehicles.id DESC";

        $data = $this->connection->query($query);

        $currentId = 0;
        $maxAmount = 0;

        while ($row = $data->fetch(PDO::FETCH_ASSOC)) {
            if ($currentId !== $row['id']) {
                $currentId = $row['id'];
                $maxAmount = 0;
            }

            if ($row['amount'] > $maxAmount) {
                $maxAmount = $row['amount'];
                $vehicles[$currentId] = [
                    'user_id' => $row['user_id'],
                    'amount' => $row['amount'],
                    'winner' => $row['winner']
                ];
            }
        }

        foreach ($vehicles as $id => $data) {
            if (!$data['winner']) {
                $userId = $data['user_id'];
                $query = "UPDATE `vehicle_auction`.`vehicles` SET `user_id` = '$userId' WHERE (`id` = '$id')";

                $data = $this->connection->query($query);

                print_r($data);
            }
        }

        return true;
    }
}

$model = new DB($pdo);
