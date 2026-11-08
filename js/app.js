document.addEventListener("DOMContentLoaded", function () {
  // 1. Simple Mock Login Handling (index.html)
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value;
      localStorage.setItem("logged_in_user", username);
      window.location.href = "shop.html";
    });
  }

  // Display greeting if user is logged in
  const greeting = document.getElementById("user-greeting");
  const storedUser = localStorage.getItem("logged_in_user");
  if (greeting && storedUser) {
    greeting.textContent = `Welcome back, ${storedUser}!`;
  }

  // 2. Mock Sell Physical Book Form (shop.html)
  const sellForm = document.getElementById("sell-book-form");
  if (sellForm) {
    sellForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Your book has been submitted for review to sell on our platform!");
      sellForm.reset();
    });
  }

  // 3. Mock Upload E-Book Form (ebook.html)
  const uploadForm = document.getElementById("upload-ebook-form");
  if (uploadForm) {
    uploadForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("E-Book uploaded successfully into the library!");
      uploadForm.reset();
    });
  }
});