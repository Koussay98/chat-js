const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('ctn');
const loginForm = document.getElementById("signin-form");
const signupForm = document.getElementById("signup-form");

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");

});
signupForm.addEventListener('submit', async(e) => {
 e.preventDefault()
  const errorElement = document.getElementById("signup-error");
  errorElement.innerHTML = ""
  const username = document.querySelector("input[name='username-signup']").value
  const email = document.querySelector("input[name='email-signup']").value
  const password = document.querySelector("input[name='password-signup']").value
  const password2 = document.querySelector("input[name='confirm']").value
  const data = { username, password,email,status:"offline" }
  console.log(data)
  try {
    if(!username || !email || !password || !password2) throw new Error("please fill in all the fields")
    if(password !== password2) throw new Error("passwords doesnt match")
    const res = await fetch("/api/users", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    console.log(res)
    const resData = await res.json()
    console.log(resData)
    if (res.status == "500") throw new Error(resData.error)
    window.location.replace("sign-in.html")
  } catch (error) {
    console.log("error")
    errorElement.innerHTML = error.message
  }


});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");

});
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const errorElement = document.getElementById("signin-error");
  errorElement.innerHTML = ""
  const username = document.querySelector("input[name='username']").value
  const password = document.querySelector("input[name='password']").value
  const data = { username, password }
  try {
    const res = await fetch("/api/users/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    console.log(res)
    const resData = await res.json()
    console.log(resData)
    if (res.status == "400") throw new Error(resData.error)
    localStorage.setItem("name", resData.username)
    window.location.replace("/")
  } catch (error) {
    errorElement.innerHTML = error.message
  }

})