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
context.fillRect(400,450,700,5);
context.fillStyle = 'rgb(0,0,255)';
context.fillRect(400,100,5,350);
context.fillStyle = 'rgb(0,0,0)';
context.beginPath();
context.moveTo(400,450)
context.lineTo(200,650)
context.strokeStyle = 'rgb(0,255,0)'
context.stroke();
context.closePath();
context.strokeStyle = 'rgb(0,0,0)'
for (let i=1;i<10;i++)
{
    context.fillRect(395,100+35*i,15,5)
    context.fillRect(400,102+35*i,700,1)

    context.fillRect(400-20*i,455+20*i,700,1)
    context.fillRect(195+20*i,300-20*i,1,350)

    context.fillRect(400+70*i,445,5,15)
    context.fillRect(402+70*i,100,1,350)

    context.beginPath();
    context.moveTo(400-20*i-5,450+20*i-5)
    context.lineTo(400-20*i+5,450+20*i+5)
    context.stroke()
    context.closePath()

    context.beginPath()
    context.strokeStyle = 'rgb(0,0,0)'
    context.lineWidth =1;
    context.moveTo(402+70*i,460)
    context.lineTo(202+70*i,660)
    context.stroke();
    context.closePath();
    context.lineWidth  =5;

    context.beginPath()
    context.strokeStyle = 'rgb(0,0,0)'
    context.lineWidth =1;
    context.moveTo(400,450-35*i)
    context.lineTo(200,650-35*i)
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

