<?php
session_start();

$email = $_POST['email'];

$_SESSION['recover'] = $email;

echo 'success';
?>
