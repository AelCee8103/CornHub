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

    $sql = "SELECT listName FROM createdlist WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Initialize an array to store list names
        $lists = array();

        // Output data of each row
        while($row = $result->fetch_assoc()) {
            // Push list name into the array
            $lists[] = $row["listName"];
        }

        $conn->close();

        // Return the list names as JSON
        echo json_encode(['lists' => $lists]);
    } else {
        // Close the connection
        $conn->close();

        // Return message if no lists found
        echo json_encode(['message' => 'You have no created list yet.']);
    }
} else {
    echo json_encode(['error' => 'Email not set in session']); 
}
?>
