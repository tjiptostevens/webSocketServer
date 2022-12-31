const {
    getMessages,
} = require("./handler");

const routes = [{
    method: "GET",
    path: "/ws",
    config: {
        id: 'hello',
        handler: getMessages,
    }

}, ]

module.exports = routes