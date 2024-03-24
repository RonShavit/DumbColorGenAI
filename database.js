const sqlite3 = require('sqlite3').verbose();
let toSend = [];
const WebSocket = require('ws');

// Set up server
const wss = new WebSocket.Server({ port: 8080 });

// Wire up some logic for the connection event (when a client connects) 
wss.on('connection', function connection(ws) {;

  // Wire up logic for the message event (when a client sends something)
  ws.on('message', function incoming(message) {
    handleData(message);
  });

  // Send a message
  while (toSend.length!=0)
  {
    ws.send(toSend.pop());
  }
});

//creates a new sql table
function createTable()
{
    let db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE,(err)=>{
        if (err) return console.error();
    })
    let sql = 'CREATE TABLE DATA(id INTEGER PRIMARY KEY AUTOINCREMENT, name STRING,r INTEGER, g INTEGER, b INTEGER)';
    db.run(sql)
    console.log("dsadas");
    db.close();
    
}

//adds a color to the db
function addColor(name, r,g,b)
{
    let db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE,(err)=>{
        if (err) return console.error();
    })
    let values = '("'+name+'", "'+r+'", "'+g+'", "'+b+'")';
    let sql = 'INSERT INTO DATA(name, r, g, b) VALUES '+values;
    console.log(sql);
    db.run(sql);
    db.close();
}

//handle data sent by client
function handleData(data = '')
{
    data = String(data);
    if (data!= '' & typeof data == 'string')
    {
    const dataArray = data.split("|");
    console.log(dataArray);
    if (dataArray[0]=='add')
        {
            let name = dataArray[1];
            let r = dataArray[2];
            let g = dataArray[3];
            let b = dataArray[4];
            addColor(name,r,g,b);
            toSend.push('added|'+name+"("+r+','+g+','+b+')');
        }
    else if (dataArray[0]=='graph')
    {
        let db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE,(err)=>{
            if (err) return console.error();
        })
        sql = 'SELECT * FROM DATA ORDER BY g DESC';
        db.all(sql,(err,data)=>
        {
            if (err) return;
            data.forEach((row)=>
            {
                toSend.push('point|'+row.r+'|'+row.g+'|'+row.b)
            })
        })
    }
    else if (dataArray[0]=='gen')
    {
        generate(dataArray[1])
    }
    else if (dataArray[0]=='guess')
    {
        guess(dataArray[1],dataArray[2],dataArray[3]);
    }
    else
    {
        toSend.push("illegal");
    }
    }
}

//generate a given color from data
function generate(name = '')
{
    console.log(name);
    var sumR=0
    var sumG=0
    var sumB=0
    var count = 0
    let db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE,(err)=>{
        if (err) return console.error();
    })
    sql = "SELECT * FROM DATA WHERE name='"+name+"'";
    console.log(sql);
    db.all(sql,(err,data)=>
    {
        if (err) return;
        data.forEach((row)=>
        {
            console.log(Number(row.r))
            sumR += Number(row.r);
            sumG += Number(row.g);
            sumB += Number(row.b);
            count++;
            console.log(sumR);
        })
        let avgR = (sumR/count).toFixed(0);
        let avgG = (sumG/count).toFixed(0);
        let avgB = (sumB/count).toFixed(0);
        toSend.push('gened|'+name+"|"+avgR+"|"+avgG+"|"+avgB);
    })

}


function guess(r,g,b)
{
    let db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE,(err)=>{
        if (err) return console.error();
    })
    sql = "SELECT * FROM DATA ORDER BY name";
    db.all(sql,(err,data)=>
    {
        if (err) return;
        let avgs ={
            'red':[0,0,0,0],
            'blue':[0,0,0,0],
            'yellow':[0,0,0,0],
            'black':[0,0,0,0],
            'white':[0,0,0,0],
            'dark gray':[0,0,0,0],
            'light gray':[0,0,0,0],
            'brown':[0,0,0,0],
            'pink':[0,0,0,0],
            'light blue':[0,0,0,0],
            'purple':[0,0,0,0],
            'orange':[0,0,0,0],
            'light green':[0,0,0,0],
            'dark green':[0,0,0,0],
            'beige':[0,0,0,0],
            'olive':[0,0,0,0],
            'turquoise':[0,0,0,0],
            'bordeaux':[0,0,0,0],


        }
        data.forEach((row)=>
        {

            avgs[row.name][3] += 1;
            if (avgs[row.name][3]>1)
            {
                avgs[row.name][0] =(avgs[row.name][0]/(avgs[row.name][3]))*(avgs[row.name][3]-1);
                avgs[row.name][0] += row.r/(avgs[row.name][3]);
                avgs[row.name][1] =(avgs[row.name][1]/(avgs[row.name][3]))*(avgs[row.name][3]-1);
                avgs[row.name][1] += row.g/(avgs[row.name][3]);
                avgs[row.name][2] =(avgs[row.name][2]/(avgs[row.name][3]))*(avgs[row.name][3]-1);
                avgs[row.name][2] += row.b/(avgs[row.name][3]);
            }
            else
            {
                avgs[row.name][0] = row.r;
                avgs[row.name][1] = row.g;
                avgs[row.name][2] = row.b;
            }
        }
        )
        let closestAvg =-1;
        let closest  = '';
        Object.keys(avgs).forEach((color)=>
        {
            avgs[color][0] = Number(avgs[color][0].toFixed(0));
            avgs[color][1] = Number(avgs[color][1].toFixed(0));
            avgs[color][2] = Number(avgs[color][2].toFixed(0));
            let distance = compareDistance(r,g,b,avgs[color][0],avgs[color][1],avgs[color][2])
            if (closestAvg == -1 | distance<closestAvg)
            {
                closestAvg = distance;
                closest = color;
            }
        });
        toSend.push('guessed|'+closest+"|"+r+'|'+g+'|'+b);
    })
}

function compareDistance(x1,x2,x3,y1,y2,y3)
{
    let sum = Math.pow(y1-x1,2)+Math.pow(y2-x2,2)+Math.pow(y3-x3,2)
    sum = Math.sqrt(sum);
    return sum;
}