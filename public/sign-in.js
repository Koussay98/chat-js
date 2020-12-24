const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('ctn');
const loginForm = document.getElementById("signin-form");

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
  
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
  
});
loginForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const username = document.querySelector("input[name='username']").value
  console.log(username);
  localStorage.setItem("name", username)
  window.location.replace("/")
})