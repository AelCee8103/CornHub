<?php
session_start();

// Check if btnId is set and not empty
if(isset($_POST['btnId']) && !empty($_POST['btnId'])) {
    $_SESSION['movkey'] = $_POST['btnId'];
   
} else {
    
}
?>
