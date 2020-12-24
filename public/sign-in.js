const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('ctn');
const navbar = document.getElementById('navbar');
const loginForm = document.getElementById("signin-form");

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
  navbar.classList.add("orangee");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
  navbar.classList.remove("orangee");
});
loginForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const username = document.querySelector("input[name='username']").value
  console.log(username);
  localStorage.setItem("name", username)
  window.location.replace("/")
})