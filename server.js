const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.static('public'))

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/public/')
})

let currctx;
let changesMade = false

io.on('connection', (socket) => {

    socket.on('login', () => {
        console.log('New Socket: ' + socket.id)
        if(changesMade === true)
            io.to(socket.id).emit('initial-canvas', currctx)
    })

    socket.on('canvas-data', (data) => {
        currctx = data;
        changesMade = true
        socket.broadcast.emit('canvas-data', data)
    })

    socket.on('clear-canvas', () => {
        changesMade = false
        socket.broadcast.emit('clear-canvas')
    })
})

app.use((req,res,next) => {
    res.status(404).send(`<h1>404<br>
                Page Not Found</h1><br>
                <h2>Try http://localhost:5000 To Go To Homepage</h2>`)

})

http.listen(5000, () => console.log("Server Started"))