<?php

session_start();
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$database = "corn_hub";
$port = "3306";


$conn = new mysqli($servername, $username, $password, $database, $port);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


if (!isset($_SESSION['email']) || !isset($_SESSION['listName'])) {
    die("Email or List Name not set in session.");
}
$email = $_SESSION['email'];
$listName = $_SESSION['listName'];


$retrieve_listID_query = "SELECT listID FROM createdlist WHERE email = ? AND listName = ?";
$stmt_listID = $conn->prepare($retrieve_listID_query);
$stmt_listID->bind_param("ss", $email, $listName);
$stmt_listID->execute();
$stmt_listID->bind_result($listID);
$stmt_listID->fetch();
$stmt_listID->close();


if (!$listID) {
    die("List ID not found for the given email and list name.");
}


$delete_query = "DELETE FROM createdlistmovies WHERE listID = ? AND email = ?";
$stmt = $conn->prepare($delete_query);
$stmt->bind_param("is", $listID, $email);

if ($stmt->execute()) {
   
    echo "All favorite movies deleted successfully";
} else {
 
    echo "Error: " . $conn->error;
}


$stmt->close();
$conn->close();
?>
