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
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "create_account.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.status === 'success') {
                    alert(response.message);
                } else {
                    errorMsg.innerHTML = response.message;
                }
            }
        };
        xhr.send("email=" + email + "&username=" + username + "&password=" + password);
        return false; 
    }
}
