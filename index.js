const webSocketsServerPort = 8000
const webSocketServer = require('websocket').server
const http = require('http')
const { nanoid } = require("nanoid");

const server = http.createServer()
server.listen(webSocketsServerPort)
console.log("listening on port 8000")

const wsServer = new webSocketServer({
    httpServer: server
})

const clients = {}

wsServer.on('request', function(request) {
    let userID = nanoid(16)
    console.log((new Date()) + ' Received connection from ' + request.origin + '.')

    const connection = request.accept(null, request.origin)
    clients[userID] = connection

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ', message.utf8Data)

            for (key in clients) {
                clients[key].sendUTF(message.utf8Data)
                console.log('Send message to: ', clients[key])
            }
        }
    })


})