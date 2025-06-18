<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Recovery</title>
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

    .question {
      font-size: 18px;
      margin-bottom: 10px;
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

    .cancel-button {
      background-color: purple;
    }

    .cancel-button:hover {
      background-color: white;
      color: black;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="title">Account Recovery</div>
    <input type="text" class="input-field" id="email" placeholder="Enter your email">
    <div id="email-error" class="error-message"></div>

    <div class="question">What is your favorite movie?</div>
    <input type="text" class="input-field" id="favorite-movie" placeholder="Enter your favorite movie">

    <div class="question">Who is your favorite fiction character?</div>
    <input type="text" class="input-field" id="favorite-character" placeholder="Enter your favorite fiction character">

    <div class="button-container">
      <button class="cancel-button" onclick="window.location.href='login.php'">Cancel</button>
      <button class="next-button" onclick="validateAnswers()">Next</button>
    </div>
  </div>

  <script>

function startSession(email) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'start_session.php', true);
  xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhr.send('email=' + email);
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log('Session started successfully');
      window.location.href = 'passChange.php';
    } else {
      alert('Error starting session: ' + xhr.statusText);
    }
  };
}

    function validateAnswers() {
      var email = document.getElementById('email').value.trim();
      var favoriteMovie = document.getElementById('favorite-movie').value.trim();
      var favoriteCharacter = document.getElementById('favorite-character').value.trim();
      var emailError = document.getElementById('email-error');

      // Email validation using regular expression
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email === '' || favoriteMovie === '' || favoriteCharacter === '') {
        alert('Please answer all questions.');
        return;
      }
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email.');
        emailError.innerText = "Invalid email format";
        return;
      } else {
        emailError.innerText = "";
      }

     

      // Make AJAX request to PHP script
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            var response = xhr.responseText;
            if (response === 'success') {
              // Redirect to passChange.php
              console.log(response);
              startSession(email);
            } else {
              alert(response);
            }
          } else {
            alert('Error: ' + xhr.status);
          }
        }
      };
      xhr.open('POST', 'check_answers.php', true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.send('email=' + email + '&favoriteMovie=' + favoriteMovie + '&favoriteCharacter=' + favoriteCharacter);
    }
  </script>
</body>
</html>
