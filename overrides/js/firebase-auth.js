document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const logoutBtn = document.getElementById("logout-btn");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = loginForm["login-email"].value;
      const password = loginForm["login-password"].value;

      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("Logged in:", userCredential.user);
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error logging in:", error);
        });
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = signupForm["signup-email"].value;
      const password = signupForm["signup-password"].value;
      const confirmPassword = signupForm["confirm-password"].value;

      if (
        !email.endsWith("ac.jp") &&
        !email.endsWith("kanotown@gmail.com") &&
        !email.endsWith("kento@koike.app")
      ) {
        alert("大学のメールアドレスを入力してください");
        return;
      }

      if (password !== confirmPassword) {
        alert("パスワードが一致しません");
        return;
      }

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("Account created:", userCredential.user);
          const user = userCredential.user;
          // ユーザー作成成功後、確認メールを送信
          user
            .sendEmailVerification()
            .then(() => {
              // alert("確認メールが送信されました");
              // 確認メール送信後にサインアウト
              firebase
                .auth()
                .signOut()
                .then(() => {})
                .catch((error) => {
                  console.error("Error signing out:", error);
                });
            })
            .catch((error) => {
              console.error("確認メールの送信中にエラーが発生しました:", error);
            });
        })
        .catch((error) => {
          console.error("Error signing up:", error);
          if (error.code == "auth/email-already-in-use") {
            alert("既に登録済みのメールアドレスです");
          }
        });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("Logged out");
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("Error logging out:", error);
        });
    });
  }

  firebase.auth().onAuthStateChanged((user) => {
    // トークンのリセット
    // fetch("https://e.kano-lab.com/editor/store_token.php", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(),
    // });
    if (user) {
      if (false && !user.emailVerified) {
        firebase
          .auth()
          .signOut()
          .then(() => {
            alert(
              "確認メールが送信されました。メールアドレスの確認が必要です。"
            );
            window.location.href = "/login";
          })
          .catch((error) => {
            console.error("Error signing out:", error);
          });
      }

      if (document.getElementById("auth-status")) {
        document.getElementById(
          "auth-status"
        ).textContent = `Logged in as ${user.email}`;
      }

      user.getIdToken().then(function (idToken) {
        // IDトークンをPOSTリクエストで送信
        fetch("https://e.kano-lab.com/editor/store_token.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken: idToken }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              // 成功した場合にリンク先に遷移
              // window.location.href = link.href;
            } else {
              console.error("Failed to store ID token");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });

      document.body.classList.add("authenticated");
    } else {
      if (document.getElementById("auth-status")) {
        document.getElementById("auth-status").textContent = "Not logged in";
      }
    }
  });
});
