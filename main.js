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

//draws squear of given rgb color
function color(r,g,b) {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");


    context.fillStyle = "rgb("+r+","+g+","+b+")";
    document.getElementById('ta1').value=Number(r);
    document.getElementById('ta2').value=Number(g);
    document.getElementById('ta3').value=Number(b);
    context.beginPath()
    context.roundRect(window.screen.width/2-100,0,200,200,40)
    context.fill()
    context.stroke()
    
    context.closePath()
}

//reads text ares values and paints them on squear
function getColorFromTextArea()
{
    let text1 = document.getElementById('ta1').value;
    let text2 = document.getElementById('ta2').value;
    let text3 = document.getElementById('ta3').value;

    color(text1,text2,text3);
}

//genarates a random color andd fill it in
function randomizeColor()
{
   let r = (Math.random()*255).toFixed(0);
   let g = (Math.random()*255).toFixed(0);
   let b = (Math.random()*255).toFixed(0);
   document.getElementById('ta1').value=r;
   document.getElementById('ta2').value=g;
   document.getElementById('ta3').value=b;
   color(r,g,b);
}

//clear squear area
function clearColor()
{
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");
    context.fillStyle = "rgb(200,200,200)";
    context.beginPath()
    context.roundRect(window.screen.width/2-100,0,200,200,40)
    
    context.fill();
    context.fillStyle = "rgb(150,150,150)";
    for (let i=window.screen.width/2-60;i<window.screen.width/2+100;i+=80)
    {
        for (let j=0;j<200;j+=80)
        {
            context.fillRect(i,j,40,40)
        }
    }
    for (let i=window.screen.width/2-100;i<window.screen.width/2+100;i+=80)
    {
        for (let j=40;j<200;j+=80)
        {
            context.fillRect(i,j,40,40)
        }
    }
    context.beginPath()
    context.roundRect(window.screen.width/2-100,0,200,200,40)
    context.stroke()
    try{
    document.getElementById('ta1').value='';
    document.getElementById('ta2').value='';
    document.getElementById('ta3').value='';
    document.getElementById('ta4').value='';
    }
    catch{}
}

//send color on display to the server
function submit()
{


        let text1 = document.getElementById('ta1').value;
        let text2 = document.getElementById('ta2').value;
        let text3 = document.getElementById('ta3').value;
        let name = document.getElementById('colorOptions').value;
        socket.send("add|"+name+"|"+text1+"|"+text2+"|"+text3);
        clearColor();
    

}
window.addEventListener("load",function() {
    document.getElementById("but3").addEventListener("click",submit);
 })
window.addEventListener("load",function() {
    document.getElementById("but2").addEventListener("click",randomizeColor);
 })
window.addEventListener("load",function() {
    document.getElementById("but1").addEventListener("click",getColorFromTextArea);
 })
window.addEventListener("load",function() {
    document.getElementById('canvas1').addEventListener('load',clearColor)
 })

 //handle data sent by server
 function handleData(data = '')
 {
    if (data != '')
    {
        const dataArray = data.split("|");
        if (dataArray[0]=="added")
        {
            console.log('added '+dataArray[1])
        }
        else if (dataArray[0]=="gened")
        {
            if (dataArray[1]!=undefined)
            {
            console.log('gened '+dataArray[1])
            color(Number(dataArray[2]),Number(dataArray[3]),Number(dataArray[4]))
            document.getElementById('colorOptions').value=dataArray[1];
            }
        }
        else if (dataArray[0]=='guessed')
        {
            color(dataArray[2],dataArray[3],dataArray[4]);
            console.log('guessed',dataArray[1]);
            document.getElementById('colorOptions').value = dataArray[1];
            document.getElementById('ta4').innerText = 'I guess '+dataArray[1];
        }
    }
 }

//switch to graph
function graphIt()
{
    socket.send("graph|*")
    window.location.href = "graph.html";
}
function generate()
{
    let name = document.getElementById('colorOptions').value;
    socket.send('gen|'+name);
    location.reload()
}
function guess()
{
    let text1 = document.getElementById('ta1').value;
    let text2 = document.getElementById('ta2').value;
    let text3 = document.getElementById('ta3').value;
    socket.send("guess|"+text1+"|"+text2+"|"+text3)
    location.reload();
}
window.addEventListener("load",function() {
    document.getElementById("but4").addEventListener("click",graphIt);

 })



 window.addEventListener("load",function() {
    document.getElementById("but5").addEventListener("click",generate);

 })

 window.addEventListener("load",function() {
    document.getElementById("but6").addEventListener("click",guess);

 })






