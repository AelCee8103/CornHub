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

    $htmlContent = '';
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $htmlContent .= '<div value="'. $row["listName"] .'" class="button-icon-wrapper">
            <button value="'. $row["listName"] .'" onclick="openCListPage(this.textContent)" class="openlistcreatedlist">' . $row["listName"] . '</button>
            <div class="mydelete-icon">
            <img src="images/deleteIcon.png" class="delete-img" />
            </div>
            </div>';
        }
    } else {
        $htmlContent = "You have no Created List Yet";
    }

    $conn->close();

    echo json_encode(['htmlContent' => $htmlContent]);
} else {
    echo "Email not set in session";
}
?>
