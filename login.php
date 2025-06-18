<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: black;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    #heading{
      display: flex;
      justify-content: space-between;
      text-align: center;
      width: 2%;
      padding: 20px 50px;
      font-size: 3rem;
      font-weight: 100;
      margin-top: 20px;
    }
    
    .login-container {
      background-color: purple;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      text-align: center;
    }
    
    .login-container h2 {
      font-size: 24px;
      margin-bottom: 20px;
    }
    
    .login-container input[type="text"],
    .login-container input[type="password"] {
      width: 100%;
      padding: 10px;
      margin-bottom: 20px;
      border: none;
      border-radius: 5px;
      background-color: gold;
      color: black;
    }
    
    .login-container input[type="submit"] {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 5px;
      background-color: gold;
      color: black;
      cursor: pointer;
    }
    #home{
      border: none;
      background: none;
      font-size: 2rem;
    }
    #home:hover{
      border: none;
      background: none;
      font-size: 2rem;
      color: red;
    }
    
    .login-container input[type="submit"]:hover {
      background-color: white;
      color: black;
    }
    
    .error-message {
      color: red;
      font-size: 14px;
      margin-top: 5px;
    }
    
    .signup-link {
      margin-top: 10px;
      color: orange; 
    }
    
    .signup-link a {
      color: orange; 
    }
    
    .signup-link a:hover {
      color: yellow; 
    }
    #forgotpass{
      margin-top: 20px;
    }

    .forgot-password-container {
      margin-top: 20px; 
      text-align: left; 
    }

    #forgotpass {
      color: #ff9800; /* Change hyperlink text color */
      text-decoration: underline;
      font-weight: bold; /* Make the text bold */
    }

    #forgotpass:hover {
      color: #ffa726; /* Change hyperlink text color on hover */
    }

    .show-password-container {
      display: flex;
      align-items: center;
      justify-content: left;
      margin-bottom: 20px;
      color: white;
    }

    .show-password-container input[type="checkbox"] {
      margin-right: 10px;
      cursor: pointer;
    }
  </style>
  <script src="https://kit.fontawesome.com/6f38b70ccc.js" crossorigin="anonymous"></script>
</head>
<body>
<div id="heading">
    <!-- this is the back button to go to the main page  -->
    <button id="home"><a href="./index.php"><i class="fas fa-chevron-left"></i></a></button>
  </div>
  <div class="login-container">
    <h2>Login to CornHub</h2>
    <form id="login-form" action="#" method="POST">
        <input type="text" name="email" id="email" placeholder="email" required><br>
        <input type="password" name="password" id="password" placeholder="Password (6-12 characters)" required><br>
        <div class="show-password-container">
          <input type="checkbox" id="show-password">
          <label for="show-password">Show Password</label>
        </div>
        <input type="submit" value="Login">
    </form>
    <div id="error-msg" class="error-message"></div>
    <div class="signup-link">
        Don't have an account? <a href="signup.php">Sign up here</a><br>
    </div>
    <div class="forgot-password-container">
        <a id="forgotpass" href="accountRecovery2.php">Forgot password</a> <!-- Added hyperlink for account recovery -->
    </div>
  </div>

  <script>
    document.getElementById("login-form").addEventListener("submit", function(event) {
      event.preventDefault(); 

      var email = document.getElementById("email").value;
      var password = document.getElementById("password").value;
      var errorMsg = document.getElementById("error-msg");

      console.log("Email:", email);
      console.log("Password:", password);

      if (password.length < 6 || password.length > 12) {
        errorMsg.innerHTML = "Password must be 6-12 characters long.";
        return false;
      } else {
        errorMsg.innerHTML = "";

  
        var formData = new FormData(this);

     
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "validate_login.php", true);
        xhr.onload = function() {
          if (xhr.status == 200) {
            var response = xhr.responseText;
            console.log("Response from server:", response); 
            if (response.trim() === "success") { 
              alert("Login successful");
              window.location.href = "index.php";
            } else {
              alert(response);
            }
          }
        };
        xhr.onerror = function() {
          console.error("An error occurred while processing your request.");
          document.getElementById("error-msg").innerHTML = "An error occurred while processing your request.";
        };
        xhr.send(formData);

        return true;
      }
    });

    document.getElementById("show-password").addEventListener("change", function() {
      var passwordField = document.getElementById("password");
      if (this.checked) {
        passwordField.type = "text";
      } else {
        passwordField.type = "password";
      }
    });
  </script>

</body>
</html>
