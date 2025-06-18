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
        $playlists = array();
        while($row = $result->fetch_assoc()) {
            $playlists[] = $row;
        }
        echo json_encode($playlists);
    } else {
        echo "0 results";
    }

    $conn->close();
} else {
    echo "Email not set in session";
}
?>
