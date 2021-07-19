                                                /* GLOBAL VARIABLES
======================================================================================================================*/
let socket = io();
var color = '#000000', weight = '5', isDrawing, timeout;
var resizedImage = new Image();
var tempWidth = window.innerWidth*0.9, 
    tempHeight = tempWidth*0.5;


                                                /* INITIAL PROCESS
======================================================================================================================*/
socket.emit('login')

const canvas = document.getElementById('paint');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth*0.9;
var tempWidth = canvas.width;
canvas.height = tempWidth*0.5;

                                                /* EVENT LISTENERS
======================================================================================================================*/

canvas.addEventListener('touchstart', start, false);
canvas.addEventListener('touchmove', draw, false);
canvas.addEventListener('touchend', stop, false);

canvas.addEventListener('mousedown', start, false);
canvas.addEventListener('mousemove', draw, false);
canvas.addEventListener('mouseup', stop, false);
canvas.addEventListener('mouseout', stop, false);

window.addEventListener('resize', resizeCanvas, false);


                                                /* DRAWING FUNCTIONS
======================================================================================================================*/

function start(event) {

    event.preventDefault();
    const mousePos = getMosuePositionOnCanvas(event);
    ctx.beginPath();
    ctx.moveTo(mousePos.x, mousePos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fill();

    isDrawing = true;
}

function draw(event) {
    event.preventDefault();
    if(isDrawing) {
        const mousePos = getMosuePositionOnCanvas(event);

        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
    }

    if(timeout != undefined)
        clearTimeout(timeout)

    timeout = setTimeout( () => {
        var base64ImageData = canvas.toDataURL("image/png")
        socket.emit('canvas-data', base64ImageData)
    },600)
}

function stop(event) {
    event.preventDefault();
  
    if (isDrawing) {
        ctx.stroke();
        ctx.closePath();
    }
  
    isDrawing = false;
}


                                                    /* HELPER-FUNCTIONS
 =========================================================================================================================*/

 function changecolor(c) {
    color = c.value;
    ctx.strokeStyle = color;
}

function changeweight(c) {
    weight = c.value;
    ctx.lineWidth = weight;
}

function clearcanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    socket.emit('clear-canvas')
}

function resizeCanvas() {
    socket.emit('resize-data');
    
    tempWidth = window.innerWidth*0.9;
    canvas.width = tempWidth;
    tempHeight = tempWidth*0.5;
    canvas.height = tempHeight;
    
    if(resizedImage !== undefined){
        resizedImage.onload = () => {
            ctx.drawImage(resizedImage, 0,0, tempWidth, tempHeight);
        }
    }
}

 function getMosuePositionOnCanvas(event) {
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const { offsetLeft, offsetTop } = event.target;
    const canvasX = clientX - offsetLeft;
    const canvasY = clientY - offsetTop;
  
    return { x: canvasX, y: canvasY };
  }

                                            /* WEB-SOCKETS
 ======================================================================================================================*/
// socket.on('initial-canvas', (data) => {
//     var image = new Image()
//     var canvas = document.querySelector('#paint')
//     ctx = canvas.getContext('2d');

//     image.onload = () => {
//         ctx.drawImage(image, 0, 0)
//     }
//     image.src = data
// })

socket.on('clear-canvas', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})

socket.on('resized-data', (data) => {
    resizedImage.src = data;
})

socket.on('canvas-data', (data) => {
    var image = new Image();
    image.src = data;

    image.onload = () => {
        ctx.drawImage(image, 0, 0, tempWidth, tempHeight)
    }
})
