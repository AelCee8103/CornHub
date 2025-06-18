<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Recovery</title>
  <link rel="stylesheet" href="recovery-styles.css">
</head>
<body>
  <div class="recovery-container">
    <h2>Answer the questions for your account recovery.</h2>
    <form id="recoveryForm" action="" method="POST" >
      <div class="question">
        <label for="favoriteMovie">What is your favorite movie?</label><br>
        <input type="text" name="favoriteMovie" id="favoriteMovie" required><br>
      </div>
      <div class="question">
        <label for="favoriteCharacter">Who is your favorite fictional character?</label><br>
        <input type="text" name="favoriteCharacter" id="favoriteCharacter" required><br>
      </div>
      <input type="submit" value="Submit Answers">
    </form>
    <div id="recovery-error-msg" class="error-message"></div>
  </div>

  <script>
    function sendRecoveryData() {
      var favoriteMovie = document.getElementById("favoriteMovie").value;
      var favoriteCharacter = document.getElementById("favoriteCharacter").value;
      var errorMsg = document.getElementById("recovery-error-msg");

      if (favoriteMovie.trim() === "" || favoriteCharacter.trim() === "") {
        errorMsg.innerHTML = "All fields are required.";
        return false;
      } else {
        function sendFormData() {
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
    //logic of anything
      
    }
}

        return true;
      }
    }
  </script>

  <script src="recovery.js"></script>
</body>
</html>
