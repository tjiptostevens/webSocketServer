const Hapi = require("@hapi/hapi");
const Nes = require('@hapi/nes')
const routes = require("./src/routes");
const http = require('http')

const WebSocket = require('ws');

const server = Hapi.server({
    port: 8000,
    host: 'localhost',

});
const wss = new WebSocket.Server({ server: server.listener });

const init = async() => {
    // await server.register({
    //     routes: {
    //         cors: {
    //             origin: ["*"],
    //         },
    //     },
    // });
    await server.register(wss);
    server.route(routes);
    try {
        await server.start();
        console.log(`Server berjalan pada ${server.info.uri}`);
    } catch (error) {
        console.log(error)
    }

}

init();