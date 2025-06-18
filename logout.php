<?php

session_start();


$_SESSION = array();


session_destroy();

if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time()-42000, '/');
}

echo "<script>alert('You have been logged out.');</script>";

echo "<script>window.location.href = 'index.php';</script>";
?>
