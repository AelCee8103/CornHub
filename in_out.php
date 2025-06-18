<?php
session_start();

if(isset($_SESSION['email'])) {
    echo "<script>window.location.href = 'logout.php';</script>";
} else {
    echo "<script>window.location.href = 'login.php';</script>";
}

?>
