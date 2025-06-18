<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enter your new password</title>
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

    .container {
      background-color: purple;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      text-align: center;
    }

    .title {
      font-size: 24px;
      margin-bottom: 20px;
    }

    .input-field {
      width: 100%;
      padding: 10px;
      margin-bottom: 20px;
      border: none;
      border-radius: 5px;
      background-color: gold;
      color: black;
    }

    .error-message {
      color: red;
      font-size: 14px;
      margin-top: 5px;
    }

    .button-container {
      display: flex;
      justify-content: flex-end;
    }

    .button-container button {
      padding: 10px 20px;
      margin-left: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      background-color: gold;
      color: black;
    }

    .button-container button:hover {
      background-color: white;
      color: black;
    }

    .back-button {
      background-color: purple;
    }

    .back-button:hover {
      background-color: white;
      color: black;
    }

    .save-button {
      background-color: purple;
    }

    .save-button:hover {
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
  <div class="container">
    <div class="title">Enter your new password</div>
    <input type="password" class="input-field" id="new-password" placeholder="Enter your new password">
    <input type="password" class="input-field" id="confirm-password" placeholder="Re-enter your new password">
    <div class="show-password-container">
      <input type="checkbox" id="show-password">
      <label for="show-password">Show Password</label>
    </div>
    <div id="password-match-error" class="error-message"></div>

    <div class="button-container">
      <button class="back-button" onclick="window.location.href='accountRecovery2.php'">Back</button>
      <button class="save-button" onclick="savePassword()">Save</button>
    </div>
  </div>

  <script>
    function savePassword() {
      var newPassword = document.getElementById('new-password').value.trim();
      var confirmPassword = document.getElementById('confirm-password').value.trim();

      if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (newPassword.length < 6 || newPassword.length > 12) {
        alert("Password must be between 6 and 12 characters long");
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var response = xhr.responseText;
            if (response === 'success') {
              alert('Password updated successfully');
              window.location.href = 'index.php';
            } else {
              alert('Error updating password: ' + response);
            }
          } else {
            alert('Error: ' + xhr.status);
          }
        }
      };
      xhr.open('POST', 'update_password.php', true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send('newPassword=' + newPassword);
    }

    document.getElementById("show-password").addEventListener("change", function() {
      var newPasswordInput = document.getElementById("new-password");
      var confirmPasswordInput = document.getElementById("confirm-password");
      if (this.checked) {
        newPasswordInput.type = "text";
        confirmPasswordInput.type = "text";
      } else {
        newPasswordInput.type = "password";
        confirmPasswordInput.type = "password";
      }
    });
  </script>
</body>
</html>
