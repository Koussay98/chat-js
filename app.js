var express = require('express')
var bodyParser = require('body-parser')
var rabbitConn = require('./connection')
var app = express()
var router = express.Router()
var server = require('http').Server(app)
var io = require('socket.io')(server)
let onlineUsers = {}
var chat = io.of('/chat')
const User = require("./User")
chat.on("connection", (socket => {
  onlineUsers[socket.id] = ""
  socket.on("user-connected", (username) => {
    onlineUsers[socket.id] = username
    chat.emit('user-connected', onlineUsers)

  })
  socket.on('disconnecting', () => {
    delete onlineUsers[socket.id]
    chat.emit('user-connected', onlineUsers)


  });
}))

rabbitConn(function (conn) {
  conn.createChannel(function (err, ch) {
    if (err) {
      throw new Error(err)
    }
    var ex = 'chat_ex'

    ch.assertExchange(ex, 'fanout', { durable: false })
    ch.assertQueue('', { exclusive: true }, function (err, q) {
      if (err) {
        throw new Error(err)
      }
      ch.bindQueue(q.queue, ex, '')
      ch.consume(q.que, function (msg) {
        chat.emit('chat', msg.content.toString())
      })
    }, { noAck: true })
  })
})


app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
router.route('/chat')

  .post(function (req, res) {
    rabbitConn(function (conn) {
      conn.createChannel(function (err, ch) {
        if (err) {
          throw new Error(err)
        }
        var ex = 'chat_ex'
        var q = 'chat_q'
        var msg = JSON.stringify(req.body)

        ch.assertExchange(ex, 'fanout', { durable: false })
        ch.publish(ex, '', new Buffer.from(msg), { persistent: false })
        ch.assertQueue(q, { durable: true })
        ch.sendToQueue(q, new Buffer.from(msg), { persistent: true })
        ch.close(function () { conn.close() })
      })
    })
  })

  .get(function (req, res) {
    rabbitConn(function (conn) {
      conn.createChannel(function (err, ch) {
        if (err) {
          throw new Error(err)
        }

        var q = 'chat_q'

        ch.assertQueue(q, { durable: true }, function (err, status) {
          if (err) {
            throw new Error(err)
          }
          else if (status.messageCount === 0) {
            res.send('{"messages": 0}')
          } else {
            var numChunks = 0;

            res.writeHead(200, { "Content-Type": "application/json" })
            res.write('{"messages": [')

            ch.consume(q.que, function (msg) {
              var resChunk = msg.content.toString()
              res.write(resChunk)
              numChunks += 1
              numChunks < status.messageCount && res.write(',')
              if (numChunks === status.messageCount) {
                res.write(']}')
                res.end()
                ch.close(function () { conn.close() })
              }
            })
          }
        })
      }, { noAck: true })
    })
  })
router.get("/users/online", async (req, res) => {
  const onlineUsers = await User.findAll({
    attributes: ['username'],
    where: {
      status: "online"
    }
  });
  res.send(onlineUsers)
})
router.put("/users/:username", async (req, res) => {
  const { status } = req.body
  console.log(req.params);
  if (status !== "online" && status !== "offline")
    return res.sendStatus(400)
  await User.update({
    status
  }, {
    where: {
      username: req.params.username
    }
  });
  res.sendStatus(200)
})
router.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body)
    return res.send(user)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})
router.post("/users/login", async (req, res) => {
  console.log(req.body)
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(400);
  const user = await User.findAll({
    where: {
      username
    }
  });
  if (!user[0]) return res.status(400).send({ error: "No such user found" })
  if (user[0].password !== password) return res.status(400).send({ error: "verify your credentials" })
  user[0].status = "online";
  await user[0].save();
  res.send({ username: user[0].username })
})

app.use('/api', router)

server.listen(3030, '0.0.0.0',
  function () {
    console.log('Chat at localhost:3030')
  }
)
