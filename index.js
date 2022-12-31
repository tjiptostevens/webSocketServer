const webSocketsServerPort = 8000
const webSocketServer = require('websocket').server
const http = require('http')
const { nanoid } = require("nanoid");

const mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dcd'
});

con.connect(async(err) => {
    if (err) throw err;
    console.log("DB Connected!");
});

const id = nanoid(16);

const server = http.createServer()
server.listen(webSocketsServerPort)
console.log("listening on port 8000")

const wsServer = new webSocketServer({
    httpServer: server
})

const clients = {}

wsServer.on('request', (request) => {
    console.log((new Date()) + ' Received connection from ' + request.origin + '.')

    const connection = request.accept(null, request.origin)
    clients[id] = connection

    connection.on('message', async(message) => {
        // Parse the message and save it to the database
        let res = await JSON.parse(message.utf8Data);
        console.log(res)
        const { sender, msg } = res
        if (message.type === 'utf8') {
            console.log('Received Message: ', res)
            con.query(
                // await con.execute(
                'INSERT INTO tabmessage (id, sender, message, timestamp) VALUES (?, ?, ?, ?)', [id, sender, msg, new Date()]
            );

            for (key in clients) {
                console.log(key)
                let rows = []
                rows = con.query(
                    // const [rows] = await con.execute(
                    'SELECT * FROM  tabmessage'
                );
                console.log(rows)
                    // clients[key].send(JSON.stringify(rows));
                clients[key].sendUTF(rows)
                console.log('Send message to: ', clients[key])
            }
            // Send the saved messages to the client
        }
    })

})