//draw a given point on graph using (r,g,b) as (x,y,z)
function drawPoint(r,g,b)
{
    console.log(r+g+b)
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d");
    context.fillStyle = 'rgb('+r+','+g+','+b+')';
    context.beginPath();
    context.arc(400+r*(700/255)-g*(200/255),450-b*(350/255)+g*(200/255),g/35+10,0,Math.PI*2);
    context.fill();
    context.lineWidth = 1;
    context.stroke()
    context.closePath();
}
