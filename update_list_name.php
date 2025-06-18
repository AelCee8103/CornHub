<?php
session_start();


if(isset($_SESSION['email'])) {
    
    $email = $_SESSION['email'];

    
    $servername = "localhost";
    $username = "root";
    $password = "";
    $database = "corn_hub";
    $port = "3306";

    
    $conn = new mysqli($servername, $username, $password, $database, $port);

    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    
    $newListName = $_POST['newListName'];
    $previousListName = $_POST['previousListName'];

    
    $sql = "UPDATE createdlist SET listName = '$newListName' WHERE email = '$email' AND listName = '$previousListName'";
    if ($conn->query($sql) === TRUE) {
        echo "List name updated successfully";
    } else {
        echo "Error updating list name: " . $conn->error;
    }

    $conn->close();
} else {
    echo "Email not set in session";
}
?>
