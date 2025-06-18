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

$movieId = $_POST['movieId'];

$delete_query = "DELETE FROM watchlist WHERE movieKey = ?";
$stmt = $conn->prepare($delete_query);
$stmt->bind_param("i", $movieId);

if ($stmt->execute()) {
   
    echo "Movie deleted successfully";
} else {
   
    echo "Error: " . $conn->error;
}


$stmt->close();
$conn->close();
?>
