<?php

session_start();
$servername = "localhost";
$username = "root";
$password = "";
$database = "corn_hub";
$port = "3306";

$conn = new mysqli($servername, $username, $password, $database, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$email = $_SESSION['email'];

$retrieve_query = "SELECT * FROM watchlist WHERE email = ?";
$stmt = $conn->prepare($retrieve_query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

$movieIds = array();
while ($row = $result->fetch_assoc()) {
    $movieIds[] = $row['movieKey'];
}

$stmt->close();
$conn->close();

$_SESSION['back'] = 1;

echo json_encode($movieIds);

?>
