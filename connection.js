// Edit this file and rename as `connection.js`

var amqp = require('amqplib/callback_api')


module.exports = function (cb) {
  amqp.connect('amqp://localhost',  // Your connection URL
    function (err, conn) {
      if (err) {
        throw new Error(err)
      }

      cb(conn)
    })
}
