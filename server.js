const express = require('express')
const app = express()
const path  = require('path')
const http = require('http').createServer(app)
const io = require('socket.io')(http)


app.use(express.static(path.join(__dirname ,'public')));

const port = process.env.PORT || 8000;

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/public/')
})

let currctx;
let changesMade = false

io.on('connection', (socket) => {

    socket.on('login', () => {
        if(changesMade === true)
            io.to(socket.id).emit('canvas-data', currctx)
    })
    socket.on('resize-data', () => {
        if(changesMade === true)
            io.to(socket.id).emit('resized-data', currctx)
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

// So that page renders again when we press the backbutton
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
  

app.use('*', (req,res) => {
    res.sendFile(__dirname + '/public/404.html')
})

http.listen(port, () => console.log("Server Started on: " + port))