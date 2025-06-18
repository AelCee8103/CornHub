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


$email = $_POST['email'];
$password = $_POST['password'];


$stmt = $conn->prepare("SELECT email, password FROM accounts WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();


if ($stmt->num_rows > 0) {
    
    $stmt->bind_result($dbEmail, $dbPassword);
    $stmt->fetch();

    
    if ($password === $dbPassword) {
        
        $_SESSION['email'] = $email;
        echo 'success';
    } else {
        
        echo 'Incorrect password';
    }
} else {
    
    echo 'Email not found';
}


$stmt->close();
$conn->close();
?>
