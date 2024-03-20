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
    console.log("dendign");
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
    else
    {
        toSend.push("illegal");
    }
    }
}
