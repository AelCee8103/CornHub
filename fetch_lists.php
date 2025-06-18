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
            $htmlContent .= '<div value="'. $row["listName"] .'" class="editlistbutton-icon-wrapper">
            <span data-previous="'. $row["listName"] .'" value="'. $row["listName"] .'"  class="editlistcreatedlist">' . htmlspecialchars($row["listName"]) . '</span>
            <div class="editlistdelete-icon">
                <img src="images/editIcon.png" class="editlistdelete-img" />
            </div>
          </div>';
        }
    } else {
        $htmlContent = "You have no created list yet.";
    }

    $conn->close();

    echo json_encode(['htmlContent' => $htmlContent]);
} else {
    echo json_encode(['htmlContent' => "Email not set in session"]);
}
?>
