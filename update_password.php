<?php
session_start();


if (!isset($_SESSION['recover'])) {
    echo 'User is not logged in';
    exit;
}


$email = $_SESSION['recover'];


$newPassword = $_POST['newPassword'];


if (strlen($newPassword) < 6 || strlen($newPassword) > 12) {
    echo 'Password must be between 6 and 12 characters long';
    exit;
}


$servername = "localhost";
$username = "root";
$password = "";
$database = "corn_hub";
$port = "3306";

$conn = new mysqli($servername, $username, $password, $database, $port);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$sql = "UPDATE accounts SET password = '$newPassword' WHERE email = '$email'";

if ($conn->query($sql) === TRUE) {
    $_SESSION['email']= $_SESSION['recover'];
    echo 'success';
} else {
    echo 'Error updating password: ' . $conn->error;
}

$conn->close();
?>
