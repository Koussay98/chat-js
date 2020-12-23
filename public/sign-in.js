const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('ctn');
const navbar = document.getElementById('navbar');

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
  navbar.classList.add("orangee");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
  navbar.classList.remove("orangee");
});