<?php
session_start();

if (isset($_SESSION['back'])) {
    $back = $_SESSION['back'];

    
    switch ($back) {
        case 0:
            echo "<script>window.location.href = 'index.php';</script>";
            break;
        case 1:
            echo "<script>window.location.href = 'myfav.php';</script>";
            break;
        case 2:
            echo "<script>window.location.href = 'myList.php';</script>";
            break;
        default:
        echo "<script>alert('no session');</script>";
            break;
    }
} else {
    echo "Session variable 'back' is not set.";
}
?>
