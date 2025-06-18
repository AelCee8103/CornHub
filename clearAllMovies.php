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


$delete_query = "DELETE FROM watchlist WHERE email = ?";
$stmt = $conn->prepare($delete_query);
$stmt->bind_param("s", $email);

if ($stmt->execute()) {
    
    echo "All favorite movies deleted successfully";
} else {
    
    echo "Error: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
