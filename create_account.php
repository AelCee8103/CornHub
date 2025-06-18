<?php

$servername = "localhost";
$username = "root";
$password = "";
$database = "corn_hub";
$port = "3306";

$conn = new mysqli($servername, $username, $password, $database, $port);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$email = $conn->real_escape_string($_POST['email']);
$username = $conn->real_escape_string($_POST['username']);
$password = $conn->real_escape_string($_POST['password']);
$favMovie = $conn->real_escape_string($_POST['favMovie']);
$favCharacter = $conn->real_escape_string($_POST['favCharacter']);


$sql_check_email = "SELECT * FROM accounts WHERE email = ?";
$stmt_check_email = $conn->prepare($sql_check_email);
$stmt_check_email->bind_param("s", $email);
$stmt_check_email->execute();
$stmt_check_email->store_result();

if ($stmt_check_email->num_rows > 0) {
    
    echo "Error: Someone already used this email.";
  
} else {
   
    $sql_insert_accounts = "INSERT INTO accounts (email, username, password) VALUES (?, ?, ?)";
    $stmt_insert_accounts = $conn->prepare($sql_insert_accounts);
    $stmt_insert_accounts->bind_param("sss", $email, $username, $password);

    if ($stmt_insert_accounts->execute()) {
        $sql_insert_recovery = "INSERT INTO recovery_table (accounts, question1_Answer, question2_Answer) VALUES (?, ?, ?)";
        $stmt_insert_recovery = $conn->prepare($sql_insert_recovery);
        $stmt_insert_recovery->bind_param("sss", $email, $favMovie, $favCharacter);

        if ($stmt_insert_recovery->execute()) {
            echo "RecordInserted";
        } else {
            echo "Error: " . $sql_insert_recovery . "<br>" . $conn->error;
        }

        $stmt_insert_recovery->close();
    } else {
        echo "Error: " . $sql_insert_accounts . "<br>" . $conn->error;
    }

    $stmt_insert_accounts->close();
}

$stmt_check_email->close();
$conn->close();
?>
