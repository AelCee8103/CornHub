


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <!--=============== REMIXICONS ===============-->

     <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet">

     <!--=============== CSS ===============-->
     <link rel="stylesheet" href="assets/css/styles.css">
    <!-- website title  -->
    <title>CornHub</title>
    <!-- fontawesome icon link -->
    <script src="https://kit.fontawesome.com/6f38b70ccc.js" crossorigin="anonymous"></script>
    <!-- style css link  -->
    <link rel="stylesheet" href="style.css">
</head>
<!-- body begains here  -->
<body>
    <!-- this is the main div of the website -->
    <div id="main">
        <!-- this is the header part  -->
        <div id="header">
            <!-- this is the website IMDb logo which is in the form of image  -->
            <div id="logodiv">
                <a href="index.php"><img id="logoimg" src="images\CornHub_Logo.png" alt="IMDb"></a>
            </div>

            <!-- this is the search section  -->
            <div id="search-bar">
                <div class="search-content">
                    <div id="search-area">
                        <!-- this is the input area for searching the movie  -->
                        <input type="text" name="searchMovie" id="searchMovie" placeholder="Search IMDb"
                            autocomplete="off">
                    </div>
                    <!-- here the results will be displayed  -->
                    <div class="results">
                        <ul>
                            <li></li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- this is the header right section were the fav movies are displayed  -->
            <div id="right-section">
            <h2><?php
            session_start();
            if(isset($_SESSION['email'])) {
                $servername = "localhost";
                $username = "root";
                $password = "";
                $database = "corn_hub";
                $port = "3306";
                
                // Create connection
                $conn = new mysqli($servername, $username, $password, $database, $port);
                
                // Check connection
                if ($conn->connect_error) {
                    die("Connection failed: " . $conn->connect_error);
                }
                
                // Retrieve the email from the session
                if (isset($_SESSION['email'])) {
                    $email = $_SESSION['email'];
                
                    // Prepare the SQL statement to prevent SQL injection
                    $stmt = $conn->prepare("SELECT username FROM accounts WHERE email = ?");
                    $stmt->bind_param("s", $email);
                
                    // Execute the statement
                    $stmt->execute();
                
                    // Bind the result to a variable
                    $stmt->bind_result($username);
                
                    // Fetch the result
                    if ($stmt->fetch()) {    
                        echo "Hello, " . $username;
                    } else {
                        
                    }
                
            
                    $stmt->close();
                } else {
                    
                }
                
                $conn->close();
               
            } else {
               
               
            }
            ?></h2>
               <!-- button to redirect to login page -->
    <button id="login-btn">
        <a href="./in_out.php"><?php
         $_SESSION['back'] = 0;
if(isset($_SESSION['email'])) {
   
    echo "Logout";
} else {
    
    echo "Login";
}
?></a>
    </button>
  
    <!-- button to redirect to fav section -->
    <button id="my-list">
        <a href="./wlist_isLogin.php">Watchlist❤️</a>
    </button>
            </div>
        </div>
        <!-- this is the movie container here all the movies are displayed  -->
        <div id="movie-container">
            <div class="movie-element"></div>
        </div>
    </div>

    <!-- this is the next and prev btn to go to next page  -->
    <div class="page-navigation">
        <button id="prev-page">Prev</button>
        <button id="next-page">Next</button>
    </div>

    </div>


    <div class="floating">
        <div class="floating__container">
            <div onclick="isLogin()" class="floating__toggle" id="floating-toggle">
                <i class="ri-add-line"></i>
            </div>

            <ul>
                <!-- floating icon 1 -->
                <a href="#"   class="floating__link" onclick="showCreateListModal()">
                    <div class="floating__icon">
                        <i class="ri-pencil-fill"></i>
                    </div>
                </a>
                 <!-- floating icon 2 -->
                <a  class="floating__link">
                    <div onclick="showOpenListModal()"  class="floating__icon">
                        <i  class="ri-menu-2-fill"></i>
                    </div>
                </a>

                <!-- Remove this mic icon button -->
              <a href="#" onclick="showEditListModal()" class="floating__link">
                    <div class="floating__icon">
                        <i class="ri-edit-box-fill"></i>
                    </div>
                </a> 
            </ul>
        </div>
    </div>

    
<!-- Add this HTML structure for the modal -->
<div id="myModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <!-- Modal content -->
        <h1>Add to List</h1>
      
        <hr>
        <br>
        <button id="watchlist" class="watchlist" onclick ="addMovieToCreatedList(btnIdValue, listName)">Watchlist</button>
        <div class="watchlist-container">
            <button id="watchlist" class="watchlist" onclick ="addMovieToCreatedList(btnIdValue, listName)">Watchlist</button>
             <!-- populate content here-->

        </div> 
    </div>
</div>




<!-- modal for opening created list -->

<div id="myListModal" class="openlistmodal">
    <div class="openlistmodal-content">
        
        <!-- Modal content -->
        <h1>Your Created Lists  <span class="openlistclose">&times;</span></h1>
      
        <hr>
        
        <div class="openlistwatchlist-container">
            <!-- populate elements here -->
            
        </div> 
    </div>
</div>

<!-- Modal for creating a list -->
<div id="createListModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h1>Create a List</h1>
        <hr>
        <br>
        <form id="createListForm">
    <input type="text" id="listNameInput" name="listName" placeholder="Enter List Name" required>
    <button type="submit" id="createListBtn">Create List</button>
</form>
        
    </div>
</div>



<!-- Modal for Editing Lis-->


<div id="editListModal" class="editlistmodal">
    <div class="editlistmodal-content">
        
        <!-- Modal content -->
        <h1>Edit a List<span class="editlistclose">&times;</span></h1>
      
        <hr>
        
        <div class="editlistwatchlist-container">
            
           

        </div> 
    </div>
</div>


    <!--=============== MAIN JS ===============-->
    <script src="assets/js/main.js"></script>
    <!-- the javascript for the main page is linked here  -->
    <script type="text/javascript" src="script.js"></script>

</body>

</html>

