# 新規登録

<div id="loginInfo">
   <form id="registerForm">
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" required><br>
        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br>
        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" required><br><br>
        <button type="submit">Register</button>
    </form>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // ユーザー入力を取得
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    // リクエストを送信
    fetch('https://docs.kano-lab.com/auth/wp-json/protected/v1/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
            email: email
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.user_id) {
            alert('User registered successfully! User ID: ' + data.user_id);
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
  });
});
</script>
