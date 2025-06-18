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
$movieId = $_POST['movieId'];
$listName = $_POST['listName'];

$listID_query = "SELECT listID FROM createdlist WHERE email = ? AND listName = ?";
$stmt = $conn->prepare($listID_query);
$stmt->bind_param("ss", $email, $listName);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $listID = $row['listID'];


    $movie_check_query = "SELECT * FROM createdlistmovies WHERE email = ? AND listID = ? AND movieKey = ?";
    $stmt = $conn->prepare($movie_check_query);
    $stmt->bind_param("sis", $email, $listID, $movieId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
  
        echo "Error: Movie already exists in the list";
    } else {
      
        $stmt = $conn->prepare("INSERT INTO createdlistmovies (listID, email, movieKey) VALUES (?, ?, ?)");
        $stmt->bind_param("isi", $listID, $email, $movieId);

       
        if ($stmt->execute()) {
            echo "Movie added to list successfully";
        } else {
            echo "Error: " . $conn->error;
        }
    }
} else {
    echo "Error: List not found";
}


$stmt->close();
$conn->close();
?>
