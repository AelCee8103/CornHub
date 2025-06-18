<?php
session_start();

header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$database = "corn_hub";
$port = "3306";

$conn = new mysqli($servername, $username, $password, $database, $port);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$email = $_SESSION['email'] ?? null;

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit();
}

$listName = $_POST['listName'] ?? '';

if (empty($listName)) {
    echo json_encode(['success' => false, 'message' => 'List name is required.']);
    exit();
}

$stmt_check = $conn->prepare("SELECT * FROM createdlist WHERE email = ? AND listName = ?");
$stmt_check->bind_param("ss", $email, $listName);
$stmt_check->execute();
$result = $stmt_check->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'List with this name already exists for the user.']);
    exit();
}

$stmt = $conn->prepare("INSERT INTO createdlist (email, listName) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $listName);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'New list created successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $stmt->error]);
}

$stmt_check->close();
$stmt->close();
$conn->close();
?>
