// Sign In
const form = document.getElementById("login-form");
const loginSection = document.getElementById("login-section");
const mainSection = document.getElementById("main-section");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;

  if (username === "admin" && password === "admin123") {
    loginSection.classList.add("hidden");
    mainSection.classList.remove("hidden");
  } else {
    alert("Invalid credentials");
  }
});
