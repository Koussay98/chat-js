var name = localStorage.getItem("name");
if (!name || name === "null") window.location.replace("/sign-in.html")
var chatSocket = io('/chat')
chatSocket.on('chat', function (message) {
  console.log(message);
  if (message.startsWith('"')) message = JSON.parse(message);
  updateFeed(message, 'append')
})
// chatSocket.emit('user-connected', name);
// chatSocket.on('user-connected', function (onlineUsers) {
//   const names = Object.values(onlineUsers)
//   $(".contacts").html("")
//   names.forEach(name => {
//     const userCircle = `<li class="active">
//     <div class="d-flex bd-highlight">
//       <div class="img_cont">
//         <img src="profile.svg" class="rounded-circle user_img">
//         <span class="online_icon"></span>
//       </div>
//       <div class="user_info">
//         <span>${name} </span>
//         <p>${name} is online</p>
//       </div>
//     </div>
//   </li>`
//     $(".contacts").append(userCircle)

//   })

// })
$('#name').val(name)

$(document).ready(function () {
  getMessages();
  getOnlineUsers();
})
$("#logout").on("click", async (e) => {
  // name = "";

  localStorage.setItem("name", "")
  const res = await fetch(`/api/users/${name} `, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: "offline" })
  })
  if (res.status == "200") window.location.replace("/sign-in.html")

})




function updateFeed(message, method) {
  let newMessage;
  const parts = message.split(":");
  const sender = parts[0];
  const msg = parts[1];
  if (sender == name)
    newMessage = `<div class="d-flex justify-content-end py-2 ">
    <div class="msg_cotainer_send"} >
      ${msg}
    </div>
    <span style="align-self:center;">${sender}</span>
    <div class="img_cont_msg">
    <img src="profile.svg" class="rounded-circle user_img_msg">
    </div>
    </div>`
  else
    newMessage = `<div class="d-flex justify-content-start py-2">
        <div class="img_cont_msg">
          <img src="profile.svg" class="rounded-circle user_img_msg">
        </div>
        <span style="align-self:center;">${sender}</span>
        <div class="msg_cotainer">
        ${msg}
        </div>
      </div>`



  if (method === 'append') {
    $('.chat-feed').append(newMessage)
  } else if (method === 'prepend') {
    $('.chat-feed').prepend(newMessage)

  }
  $(".chat-feed").scrollTop($('.chat-feed')[0].scrollHeight)

}

async function getMessages() {
  const res = await fetch("/api/chat");
  const data = await res.json();
  console.log(data);
  if (data.messages) {

    data.messages.reverse().map(function (message) {
      updateFeed(message, 'prepend')
    })
  }

}
async function getOnlineUsers() {
  const res = await fetch("/api/users/online")
  const users = await res.json()
  $(".contacts").html("")

  users.forEach(user => {
    const userCircle = `<li class="active">
     <div class="d-flex bd-highlight">
       <div class="img_cont">
         <img src="profile.svg" class="rounded-circle user_img">
         <span class="online_icon"></span>
       </div>
       <div class="user_info">
         <span>${user.username} </span>
         <p>${user.username} is online</p>
       </div>
     </div>
   </li>`
    $(".contacts").append(userCircle)

  });

}
$('#chatForm').on('submit', function (e) {
  e.preventDefault()
  var data = $('#chatForm').serialize()
  $.ajax({
    type: 'POST',
    url: '/api/chat',
    processData: false,
    data: data
  })
  $("#message").val("")
})

setInterval(function () { getOnlineUsers() }, 1000);
