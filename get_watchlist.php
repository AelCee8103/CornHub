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

$sql = "SELECT movieKey FROM watchlist WHERE email = '$email'";
$result = $conn->query($sql);

$movieKeys = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $movieKeys[] = $row['movieKey'];
    }
}

echo json_encode($movieKeys);

$conn->close();
?>
