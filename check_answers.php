<?php

$servername = "localhost";
$username = "root";
$password = "";
$database = "corn_hub";


$conn = new mysqli($servername, $username, $password, $database);


if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}


$email = $_POST['email'];
$favoriteMovie = $_POST['favoriteMovie'];
$favoriteCharacter = $_POST['favoriteCharacter'];


$emailCheckQuery = "SELECT * FROM recovery_table WHERE accounts='$email'";
$emailCheckResult = $conn->query($emailCheckQuery);

if ($emailCheckResult->num_rows > 0) {

  $sql = "SELECT * FROM recovery_table WHERE accounts='$email' AND question1_Answer='$favoriteMovie' AND question2_Answer='$favoriteCharacter'";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    echo 'success';
  } else {
    echo 'Answers do not match.';
  }
} else {
  echo 'Email does not exist.';
}

$conn->close();
?>
