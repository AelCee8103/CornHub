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

 
    $listName = $_POST['listName'];

    $sql = "SELECT COUNT(*) AS count FROM createdlist WHERE email = '$email' AND BINARY listName = '$listName'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $exists = $row['count'] > 0; 
        echo json_encode(['exists' => $exists]);
    } else {
        echo json_encode(['exists' => false]);
    }

    $conn->close();
} else {
    echo json_encode(['error' => 'Email not set in session']);
}
?>
