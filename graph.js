// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8080');

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    handleData(event.data);
});

//draw graph
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
context.lineWidth = 5;
context.fillStyle = 'rgb(255,0,0)';
context.fillRect(400,360,700,5);
context.fillStyle = 'rgb(0,0,255)';
context.fillRect(400,10,5,350);
context.fillStyle = 'rgb(0,0,0)';
context.beginPath();
context.moveTo(400,360)
context.lineTo(200,560)
context.strokeStyle = 'rgb(0,255,0)'
context.stroke();
context.closePath();
context.strokeStyle = 'rgb(0,0,0)'
for (let i=1;i<=10;i++)
{
    context.fillRect(395,-27+35*i,15,5)
    context.fillRect(400,-25+35*i,702,1)

    context.fillRect(402-20*i,365+20*i,703,1)
    context.fillRect(175+20*i,235-20*i,1,340)

    context.fillRect(398+70*i,355,5,15)
    context.fillRect(400+70*i,10,1,350)

    context.beginPath();
    context.moveTo(400-20*i-5,360+20*i-5)
    context.lineTo(400-20*i+5,360+20*i+5)
    context.stroke()
    context.closePath()

    context.beginPath()
    context.strokeStyle = 'rgb(0,0,0)'
    context.lineWidth =1;
    context.moveTo(400+70*i,370)
    context.lineTo(205+70*i,565)
    context.stroke();
    context.closePath();
    context.lineWidth  =5;

    context.beginPath()
    context.strokeStyle = 'rgb(0,0,0)'
    context.lineWidth =1;
    context.moveTo(400,360-35*i)
    context.lineTo(195,565-35*i)
    context.stroke();
    context.closePath();
    context.lineWidth  =5
}

//handle data from server
function handleData(data = '')
{
    if (data != '')
    {
        const dataArray = data.split("|");
        console.log(data)
        if (dataArray[0]=="point")
        {
            drawPoint(Number(dataArray[1]),Number(dataArray[2]),Number(dataArray[3]));
        }
    }
}

function graphThat()
{
   colorOption = document.getElementById('colorOptionsG').value;
   socket.send("graph|"+colorOption);
   window.location.href = "graph.html";
}

window.addEventListener("load",function() {
    document.getElementById("gbut2").addEventListener("click",graphThat);

 })


