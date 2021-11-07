const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', 'Welcome!...')
    socket.broadcast.emit('message', 'A new user has joined!')

        //When a user connects
    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })

        //When a user disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })

        //to know how many users connected
    const usersInChat = socket.client.conn.server.clientsCount + 'users connected'
    socket.broadcast.emit('message', usersInChat)


})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})