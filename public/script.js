let socket = io();
let canvas, ctx, color, weight, isDrawing, timeout;

// This gives the Initial State To Canvas
socket.emit('login')

setupCanvas();

// Function To Set Up Canvas Initially
function setupCanvas() {
    canvas = document.getElementById('paint');
    var canvas_style = getComputedStyle(canvas);
    canvas.width = parseInt(canvas_style.getPropertyValue('width'));
    canvas.height = parseInt(canvas_style.getPropertyValue('height'));
    ctx = canvas.getContext('2d');
    weight = '5';
    color = '#000000'
}


// Canvas Event Listeners
canvas.addEventListener('touchstart', start, false);
canvas.addEventListener('touchmove', draw, false);
canvas.addEventListener('mousedown', start, false);
canvas.addEventListener('mousemove', draw, false);
canvas.addEventListener('touchend', stop, false);
canvas.addEventListener('mouseup', stop, false);
canvas.addEventListener('mouseout', stop, false);


// Function To Start Drawing
function start(event) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(event.clientX - canvas.offsetLeft,event.clientY - canvas.offsetTop);
    event.preventDefault();
}


// Function To Draw
function draw(event) {
    if(isDrawing) {
        ctx.lineTo(event.clientX - canvas.offsetLeft,event.clientY - canvas.offsetTop);
        ctx.strokeStyle = color;
        ctx.lineWidth = weight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round'
        ctx.stroke();
    }
    event.preventDefault();

    if(timeout != undefined)
        clearTimeout(timeout)

    timeout = setTimeout( () => {
        var base64ImageData = canvas.toDataURL("image/png")
        socket.emit('canvas-data', base64ImageData)
    },400)
}


// Function To Stop Drawing
function stop(event) {
    if(isDrawing) {
        ctx.stroke();
        ctx.closePath();
        isDrawing = false;
    }
    event.preventDefault();
}


// Function To Change Color Of Brush
function changecolor(c) {
    color = c.value;
    ctx.strokeStyle = color;
 }


// Function To Change Weight Of Brush
function changeweight(c) {
    weight = c.value;
    ctx.lineWidth = weight;
}


// Function To Clear Canvas
function clearcanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    socket.emit('clear-canvas')
}

socket.on('initial-canvas', (data) => {
    var image = new Image()
    var canvas = document.querySelector('#paint')
    ctx = canvas.getContext('2d');

    image.onload = () => {
        ctx.drawImage(image, 0, 0)
    }
    image.src = data
})

socket.on('clear-canvas', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
})

socket.on('canvas-data', (data) => {
    var image = new Image()
    var canvas = document.querySelector('#paint')
    ctx = canvas.getContext('2d');

    image.onload = () => {
        ctx.drawImage(image, 0, 0)
    }
    image.src = data
})
