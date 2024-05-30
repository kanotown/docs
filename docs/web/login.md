# ログイン

<div id="loginInfo">
  <form id="loginForm">
    <input type="text" id="username" placeholder="Username" />
    <input type="password" id="password" placeholder="Password" />
    <button type="submit">Login</button>
  </form>
</div>

<script>
  async function login(username, password) {
    const response = await fetch(
      "https://docs.kano-lab.com/auth/wp-json/jwt-auth/v1/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("jwt", data.token);
      // console.log("Login successful:", data);
      fetchProtectedResource();
    } else {
      console.error("Login failed:", data.message);
    }
  }
</script>
<script>
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      login(username, password);
    });
</script>

<script>
  async function fetchProtectedResource() {
    const token = localStorage.getItem("jwt");
    if (!token) return;
    const response = await fetch(
      "https://docs.kano-lab.com/auth/wp-json/protected/v1/resource",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      // console.log("Protected resource:", data);
      const info = document.getElementById('loginInfo');
      info.innerHTML = 'ログイン済みです。<br><br>';
      info.innerHTML += '学籍番号：' + data.username + '<br>';
      info.innerHTML += 'メールアドレス：' + data.email + '<br>';
    } else {
      console.error("Access denied:", response.status);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    fetchProtectedResource();
  });
  // checkLoginStatus();
  // fetchProtectedResource();

</script>
