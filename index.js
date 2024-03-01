var canvas= document.getElementById('canva');
    var clear= document.getElementById('clear');
    var save = document.getElementById('save');
    const ctx= canvas.getContext('2d');
    var color = document.getElementById('colorpicker');
    var bgcolor = document.getElementById('bgpicker');
    var thickness = document.getElementById('thickness');
    var isDrawing;
    var canvasStates = [];

    function getTouchPos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var touch = event.touches[0];
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

canvas.addEventListener('touchstart', function(event) {
    isDrawing = true;
    var pos = getTouchPos(canvas, event);
    lastX = pos.x;
    lastY = pos.y;
});

canvas.addEventListener('touchmove', function(event) {
    event.preventDefault();
    if (!isDrawing) return;

    var pos = getTouchPos(canvas, event);
    var currentX = pos.x;
    var currentY = pos.y;

    saveState();
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
});

canvas.addEventListener('touchend', function() {
    isDrawing = false;
});
   

        
    canvas.addEventListener('mousedown',(event)=>{
        isDrawing=true;
        laxtx=event.offsetX
        laxty=event.offsetY
    });
   
    color.addEventListener('change',()=>{
        var selectedcolor=color.value;
        ctx.strokeStyle=selectedcolor;
    })
    bgcolor.addEventListener('change',()=>{
        ctx.fillStyle = bgcolor.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    })
    thickness.addEventListener('change',()=>{
        ctx.lineWidth=thickness.value;
    })
    canvas.addEventListener('mousemove',(event)=>{
        if (isDrawing) {
            saveState();
            ctx.beginPath();
            ctx.moveTo(laxtx,laxty)
            ctx.lineTo(event.offsetX,event.offsetY)
            ctx.stroke();
            
            laxtx=event.offsetX
            laxty=event.offsetY
        }
    });
   
    canvas.addEventListener('mouseup',(event)=>{
        isDrawing=false
    });
    clear.addEventListener('click',()=>{
        ctx.clearRect(0,0,900,500)
        canvas.style.backgroundColor="white";
    });
    save.addEventListener('click', () => {
            localStorage.setItem('canvasContents', canvas.toDataURL());
            // Create a new <a> element
            let link = document.createElement('a');

            // Set the download attribute and the href attribute of the <a> element
            link.download = 'my-canvas.png';
            link.href = canvas.toDataURL();

            // Dispatch a click event on the <a> element
            link.click();
    });
    function saveState() {
            canvasStates.push(canvas.toDataURL());
        }

        // Function to undo
        function undo() {
            if (canvasStates.length > 1) {
                canvasStates.pop();
                var img = new Image();
                img.onload = function() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                };
                img.src = canvasStates[canvasStates.length - 1];
            }
        }
