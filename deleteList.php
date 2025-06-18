<?php
session_start();


$servername = "localhost";
$username = "root";
$password = "";
$database = "corn_hub";
$port = "3306";


if (!isset($_SESSION['email'])) {
    die("Error: Email not set in session.");
}
$email = $_SESSION['email'];


if (!isset($_POST['listName'])) {
    die("Error: List name not provided.");
}
$listName = $_POST['listName'];

$conn = new mysqli($servername, $username, $password, $database, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

 $stmt = $conn->prepare("SELECT listID FROM createdlist WHERE email = ? AND listName = ?");
$stmt->bind_param("ss", $email, $listName);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if ($row) {
    $listID = $row['listID'];

    $conn->begin_transaction();

    try {
        $stmt = $conn->prepare("DELETE FROM createdlistmovies WHERE listID = ?");
        $stmt->bind_param("i", $listID);
        $stmt->execute();

        $stmt = $conn->prepare("DELETE FROM createdlist WHERE listID = ? AND email = ? AND listName = ?");
        $stmt->bind_param("iss", $listID, $email, $listName);
        $stmt->execute();

        $conn->commit();
        echo "Record deleted successfully";
    } catch (Exception $e) {
        $conn->rollback();
        echo "Error deleting record: " . $e->getMessage();
    }
} else {
    echo "Error: List not found.";
}

$stmt->close();
$conn->close();
?>
