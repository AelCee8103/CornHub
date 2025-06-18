<?php

session_start();


if(isset($_SESSION['email'])) {
    echo "<script>window.location.href = 'myfav.php';</script>";
} else {
    echo "<script>alert('You have to log in first.');</script>";
    echo "<script>window.location.href = 'login.php';</script>";
}
?>
