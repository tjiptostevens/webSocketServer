const { nanoid } = require("nanoid");
const db = require('../config/db')

const id = nanoid(16);
const getMessages = async(request, h) => {
    const { ws } = request.websocket();

    ws.on('message', async message => {
        // Parse the message and save it to the database
        const { sender, receiver, text } = JSON.parse(message);
        await db.execute(
            'INSERT INTO tabmessage (id, sender, receiver, message) VALUES (?, ?, ?)', [id, sender, receiver, text]
        );
    });

    // Send the saved messages to the client
    const [rows] = await db.execute(
        'SELECT * FROM  tabmessage'
    );
    ws.send(JSON.stringify(rows));
}

module.exports = {
    getMessages
}