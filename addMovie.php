<?php

session_start();
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$database = "corn_hub";
$port = "3306";

// Create connection
$conn = new mysqli($servername, $username, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get POST data
$email = $_SESSION['email'];
$movieId = $_POST['movieId'];

// Check if the movieId exists in the watchlist for the given email
$watchlist_check_query = "SELECT * FROM watchlist WHERE email = ? AND movieKey = ?";
$stmt = $conn->prepare($watchlist_check_query);
$stmt->bind_param("si", $email, $movieId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {

    echo "Error: Movie already exists in the watchlist";
} else {
   
    $email_check_query = "SELECT email FROM accounts WHERE email = ?";
    $stmt = $conn->prepare($email_check_query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $stmt = $conn->prepare("INSERT INTO watchlist (email, movieKey) VALUES (?, ?)");
        $stmt->bind_param("si", $email, $movieId);

        if ($stmt->execute()) {
            echo "Movie added to watchlist successfully";
        } else {
            echo "Error: " . $conn->error;
        }
    } else {
        
        echo "Error: Email does not exist in the accounts table";
    }
}


$stmt->close();
$conn->close();
?>
