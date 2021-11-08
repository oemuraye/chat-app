const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    //default message
    socket.emit('message', 'Welcome!...')

    //indicates new user
    socket.broadcast.emit('message', 'A new user has joined!')

        //send messages to a user
    socket.on('sendMessage', (message, callback) => {
         filter = new Filter();

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('message', message)
        callback('Delivered')
    })

        //When a user disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })

    //sharing location
    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

        //to know how many users connected
    const usersInChat = socket.client.conn.server.clientsCount + 'users connected'
    socket.broadcast.emit('message', usersInChat)


})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})