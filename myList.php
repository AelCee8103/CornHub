<?php
session_start();
if (isset($_SESSION['email'])) {
    if (isset($_GET['listName'])) {
        $_SESSION['listName'] = $_GET['listName'];
        $listName =  $_SESSION['listName'];
        $_SESSION['back'] = 2;
        
       
    } else{
        
       
       
    }

} else {
    echo "You are not logged in yet";
}
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $_SESSION['listName'];?></title>
    <link rel="stylesheet" href="myfav.css">
    <script src="https://kit.fontawesome.com/6f38b70ccc.js" crossorigin="anonymous"></script>
</head>
<body>
    <div id="heading">
        <button id="home"><a href="./index.php"><i class="fas fa-chevron-left"></i></a></button>
        <span><?php echo $_SESSION['listName'];?></span>
        <!-- button to clear all the fav movies -->
        <div id="btns">
            <button id="clear-whole-list">Clear All</button>
        </div>
    </div>
    <!-- all the movies will be displayed here  -->
    <div id="list-container"></div>
     <!-- the javascript for the favourite page is linked here  -->
    <script src="myList1.js"></script>
</body>
</html>