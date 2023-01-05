const mysql = require('mysql');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'smiroot',
    database: 'dcd'
});

// db.connect(async(err) => {
//     if (err) throw err;
//     console.log("DB Connected!");
// });

module.exports = db