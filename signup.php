<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Create Account</title>
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
    
    .signup-container {
      background-color: purple;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      text-align: center;
    }
    
    .signup-container h2 {
      font-size: 24px;
      margin-bottom: 20px;
    }
    
    .signup-container input[type="email"],
    .signup-container input[type="text"],
    .signup-container input[type="password"] {
      width: 100%;
      padding: 10px;
      margin-bottom: 20px;
      border: none;
      border-radius: 5px;
      background-color: gold;
      color: black;
    }
    
    .signup-container button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      background-color: gold;
      color: black; 
      transition: background-color 0.3s, color 0.3s; 
    }
    
    .signup-container button:hover {
      background-color: white;
      color: black;
    }
    
    .signup-container input[type="submit"] {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 5px;
      background-color: gold;
      color: black;
      cursor: pointer;
    }
    
    .signup-container input[type="submit"]:hover {
      background-color: white;
      color: black;
    }
    
    .error-message {
      color: red;
      font-size: 14px;
      margin-top: 5px;
    }

    /* Modal CSS */
    .modal {
      display: none;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
      background-color: purple; 
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      border: none;
      width: 80%;
      max-width: 500px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5); 
    }

    .modal-content h2 {
      font-size: 24px;
      color: gold; 
      margin-bottom: 20px; 
    }

    .modal-content p {
      color: gold; 
      margin-bottom: 10px; 
    }

    .modal-content input[type="text"] {
      width: 80%;
      padding: 10px;
      margin: 10px auto;
      border: none; 
      border-radius: 5px;
      background-color: gold;
      color: black; 
    }

    .modal-content .action-buttons {
      text-align: right;
      margin-top: 20px;
    }

    .modal-content .action-buttons button {
      padding: 10px 20px;
      margin-left: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      background-color: gold; 
      color: black; 
    }

    .modal-content .action-buttons button:hover {
      background-color: white;
      color: black;
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
</head>
<body>
  <div class="signup-container">
    <h2>Create an Account</h2>
    <form id="signupForm" action="" method="POST" onsubmit="validateAndOpenModal(); return false;">
      <input type="email" name="email" id="email" placeholder="Email" required><br>
      <input type="text" name="username" id="username" placeholder="Username" required><br>
      <input type="password" name="password" id="password" placeholder="Password (6-12 characters)" required><br>
      <div class="show-password-container">
        <input type="checkbox" id="show-password">
        <label for="show-password">Show Password</label>
      </div>
      <input type="submit" value="Create Account">
    </form>
    <div id="error-msg" class="error-message"></div>
    <button onclick="goToLoginPage()">Back to Login</button>
  </div>

  <!-- Modal -->
  <div id="myModal" class="modal">
    <div class="modal-content">
      <h2>Answer questions for your account recovery.</h2>
      <form id="recoveryForm" onsubmit="sendFormData(); return false;">
        <p>What is your favorite movie?</p>
        <input type="text" id="favMovie" name="favMovie" required><br>
        <p>Who is your favorite fiction character?</p>
        <input type="text" id="favCharacter" name="favCharacter" required><br>
        <div class="action-buttons">
          <button type="button" onclick="closeModal()">Cancel</button>
          <button type="submit">Done</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    function validateAndOpenModal() {
      var email = document.getElementById("email").value;
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;
      var errorMsg = document.getElementById("error-msg");
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        errorMsg.innerHTML = "Please enter a valid email address.";
        return false;
      } else if (username.length === 0 || password.length === 0) {
        errorMsg.innerHTML = "All fields are required.";
        return false;
      } else if (password.length < 6 || password.length > 12) {
        errorMsg.innerHTML = "Password must be 6-12 characters long.";
        return false;
      } else {
        openModal();
      }
    }

    function openModal() {
      document.getElementById("myModal").style.display = "block";
    }

    function closeModal() {
      document.getElementById("myModal").style.display = "none";
    }

    function sendFormData() {
      var email = document.getElementById("email").value;
      var username = document.getElementById("username").value;
      var password = document.getElementById("password").value;
      var favMovie = document.getElementById("favMovie").value;
      var favCharacter = document.getElementById("favCharacter").value;
      var errorMsg = document.getElementById("error-msg");
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Creating an AJAX request to create_account.php
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "create_account.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            if (xhr.responseText === "RecordInserted") {
              alert("New record created successfully");
              window.location.href = "login.php"; 
            } else {
              alert(xhr.responseText); 
              closeModal(); 
              clearInputFields(); 
            }
          } else {
            alert("Error occurred while processing your request.");
          }
        }
      };
      xhr.send("email=" + email + "&username=" + username + "&password=" + password + "&favMovie=" + favMovie + "&favCharacter=" + favCharacter);
      return false; 
    }

    function clearInputFields() {
      document.getElementById("email").value = "";
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
      document.getElementById("favMovie").value = "";
      document.getElementById("favCharacter").value = "";
    }

    function goToLoginPage() {
      window.location.href = "login.php";
    }

    document.getElementById("show-password").addEventListener("change", function() {
      var passwordInput = document.getElementById("password");
      if (this.checked) {
        passwordInput.type = "text";
      } else {
        passwordInput.type = "password";
      }
    });
  </script>
</body>
</html>
