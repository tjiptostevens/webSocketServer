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
const getMessages = async(request, h) => {
    const { ws } = request.websocket();

    ws.on('message', async message => {
        // Parse the message and save it to the database
        const { sender, receiver, text } = JSON.parse(message);
        await connection.execute(
            'INSERT INTO tabmessage (id, sender, receiver, message) VALUES (?, ?, ?)', [id, sender, receiver, text]
        );
    });

    // Send the saved messages to the client
    const [rows] = await connection.execute(
        'SELECT * FROM  tabmessage'
    );
    ws.send(JSON.stringify(rows));
}

module.exports = {
    getMessages
}