const webSocketsServerPort = 8000
const webSocketServer = require('websocket').server
const http = require('http')
const { nanoid } = require("nanoid");
const db = require('./config/db')

const id = nanoid(16);

const server = http.createServer()
server.listen(webSocketsServerPort)
console.log("listening on port 8000")

const wss = new webSocketServer({
    httpServer: server
})

const clients = {}

wss.on('request', async(request) => {
    // console.log(request)
    // console.log((new Date()) + ' Received connection from ' + request.origin + '.')

    const connection = request.accept(null, request.origin)
    clients[id] = connection
    let rows = db.query(
        // let [rows] = await db.execute(
        'SELECT * FROM tabmessage', '', (error, res, field) => {
            console.log('QUERY', error)
            console.log('QUERY RES', res)
                // console.log('QUERY FIELD', field)
            clients[id].send(JSON.stringify(res));
            // clients[key].sendUTF(res)
            console.log('Send message to: ', clients[id])
        }
    );
    // rows = await JSON.stringify(rows)
    console.log("ROWS", rows)

    connection.on('message', async(message) => {
        // Parse the message and save it to the database
        let res = await JSON.parse(message.utf8Data);
        // console.log(res)
        const { sender, msg } = res
        if (message.type === 'utf8') {
            console.log('Received Message: ', message)
            db.query(
                'INSERT INTO tabmessage (id, sender, message, timestamp) VALUES (?, ?, ?, ?)', [id, sender, msg, new Date()], (error) => { console.log('INSERT QUERY', error) }
            );

            for (key in clients) {
                console.log(key)
                let rows = db.query(
                    // let [rows] = await db.execute(
                    'SELECT * FROM tabmessage', '', (error, res, field) => {
                        console.log('QUERY', error)
                        console.log('QUERY RES', res)
                            // console.log('QUERY FIELD', field)
                        clients[key].send(JSON.stringify(res));
                        // clients[key].sendUTF(res)
                        console.log('Send message to: ', clients[key])
                    }
                );
                // rows = await JSON.stringify(rows)
                console.log("ROWS", rows)
            }
            // Send the saved messages to the client
        }
    })

})