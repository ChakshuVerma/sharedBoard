let socket = io(),
    ctx,
    colour,
    weight = "5",
    timeout,
    canvas;

socket.emit('login')

drawOnCanvas()

function drawOnCanvas () {
    canvas = document.querySelector('#paint');
    ctx = canvas.getContext('2d');

    var sketch = document.querySelector('#sketch');
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));

    var mouse = {x: 0, y: 0};
    var last_mouse = {x: 0, y: 0};

    /* Mouse Capturing Work */
    canvas.addEventListener('mousemove', function(e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    }, false);


    /* Drawing on Paint App */
    ctx.lineWidth = weight;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = colour;

    canvas.addEventListener('mousedown', function(e) {
        canvas.addEventListener('mousemove', onPaint, false);
    }, false);
    
    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('mouseout', function() {
        canvas.removeEventListener('mousemove', onPaint, false);
    }, false);

    var onPaint = function() {
        ctx.beginPath();
        ctx.moveTo(last_mouse.x, last_mouse.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.closePath();
        ctx.stroke();

        if(timeout != undefined)
            clearTimeout(timeout)

        timeout = setTimeout( () => {
            var base64ImageData = canvas.toDataURL("image/png")
            socket.emit('canvas-data', base64ImageData)
        },400)
    };
}

function changecolor(c) {
    colour = c.value;
    ctx.strokeStyle = colour;
 }

function changeweight(c) {
    weight = c.value;
    ctx.lineWidth = weight;
}

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