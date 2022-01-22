const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket)  => {
    console.log("New Web Socket Connection")

    socket.on('join', ({ username, room, password}, callback) => {
        const { error, user } = addUser({
            id: socket.id,
            username,
            room,
            password
        })

        if(error) {
            return callback(error)
        }

        socket.join(user.room)  
        socket.emit('message', generateMessage('Admin', `Welcome to ${user.room}`))
        socket.broadcast.to(room).emit('message', generateMessage('Admin', `${user.username} has joined ${user.room}`))
        
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback("Delivered!")
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://www.google.com/maps/place/${coords.latitude},${coords.longitude}`))
        callback("Location Sent!")
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} Left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(PORT, (err) => {
    if(err) {
        return console.log(err.message)
    }
    console.log("Server listening on port", PORT)
})