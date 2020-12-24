var name = localStorage.getItem("name");
console.log(name, typeof (name));
if (!name || name === "null") window.location.replace("/sign-in.html")
var chatSocket = io('/chat')
$('#name').val(name)
$(document).ready(function () {

  getMessages();
  // $('#modal').modal('show')
})
$("#logout").on("click", (e) => {
  name = "";
  localStorage.setItem("name", "")
  window.location.replace("/sign-in.html")
})


$('#chatNameForm').on('submit', function (e) {
  e.preventDefault()
  // var name = $('#chatName').val() //hook this
  $('#name').val(name)
  getMessages()
})

function updateFeed(message, method) {
  let newMessage;
  if (message.name == name)
    newMessage = `<div class="msg d-flex justify-content-end mb-4' ">
    <div class="msg_cotainer_send"} >
      ${message.message}
    </div>
    <span style="align-self:center;">${message.name}</span>
    <div class="img_cont_msg">
    <img src="user-alt-solid.svg" class="rounded-circle user_img_msg">
    </div>
    </div>`
  else
    newMessage = `<div class="d-flex justify-content-start mb-4">
        <div class="img_cont_msg">
          <img src="user-alt-solid.svg" class="rounded-circle user_img_msg">
        </div>
        <span style="align-self:center;">${message.name}</span>
        <div class="msg_cotainer">
        ${message.message}
        </div>
      </div>`



  if (method === 'append') {
    $('.chat-feed').append(newMessage)
  } else if (method === 'prepend') {
    $('.chat-feed').prepend(newMessage)

  }
  $(".chat-feed").scrollTop($('.chat-feed')[0].scrollHeight)

}

function getMessages() {
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: '/api/chat',
    success: function (response) {
      if (response.messages) {
        response.messages.reverse().map(function (message) {
          updateFeed(message, 'prepend')
          $('#modal').modal('hide')
        })
      } else {
        $('#modal').modal('hide')
      }

      chatSocket.on('chat', function (message) {
        message = JSON.parse(message)
        updateFeed(message, 'append')
      })
    }
  })
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
