import WebSocket, { WebSocketServer } from 'ws';
import url from 'url';
import { World } from './src/world.js';

const wss = new WebSocketServer({ port: 8089 });

const queue = [];
const broadcast = [];
const singlecast = [];

let clientID = 0;
const clients = new Map();
const clients_ready = new Map();
const client_info = {};

// WebSocket-Verbindung akzeptieren
wss.on('connection', (ws, req) => {
    const id = clientID++;
    clients.set(id, ws);
    const params = new URLSearchParams(url.parse(req.url).query);
    const username = params.get('username');
    const color = params.get('color');

    join(id, username, color);
    
    console.log(`[SERVER] CLIENT id: ${id} username: ${username} color: ${color} connect`);

    // Nachricht vom Client empfangen
    ws.on('message', (message) => {
        message.id = id;
        queue.push(JSON.parse(message));

    });

    // Verbindung trennen
    ws.on('close', () => {
        onleave( { type: 'LEAVE', id: id } );

        console.log('Ein Client hat die Verbindung getrennt.');
    });

    // Fehlerbehandlung
    ws.on('error', (err) => {
        console.error('Fehler aufgetreten:', err);
    });

});


setInterval(function() {
    if (queue.length < 1) { return; }

    const message = queue.pop();

    try {
        console.log("[SERVER] Got message: ", message);
    } catch (err) {
        console.error("Error parsing message: ", message, err);
        return;
    }

    switch (message.type) {
        case 'JOIN':
            onjoin(message);
            break;
        case 'LEAVE':
            onleave(message);
            break;
        case 'POSITION':
            client_info[message.id]['position'] = message.position;
            break;
        default:
            break;
    }

    sender();

}, 200);


function sender() {
    if (broadcast.length > 0) {
        const message = broadcast.pop();
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(
                    JSON.stringify(message)
                );
            }
        });
    }

    if (singlecast.length > 0) {
        const message = singlecast.pop();

        const client = clients[message.id].socket;

        client.send(message);
    }

    // INFO PINGS
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            const message = JSON.stringify(
                {
                    type: 'INFO',
                    client_info: client_info
                }
            );
            client.send(message);

            console.log("[SERVER] Sent INFO \n " + message);
        }
    });
}

function join(id, username, color) {
    const position = {
        x: Math.random() * 10,
        y: 0.5,
        z: Math.random() * 10,
    }

    queue.push(
        {
            type: 'JOIN',
            id: id,
            name: username,
            position: position,
            color: color
        }
    );

    client_info[id] = {
        name: username,
        position: position,
        color: color
    }

    send(id, {
        type: 'SETID',
        your_id: id,
        clientname: username,
        color: color
    });
}

function onjoin(message) {


    broadcast.push(
        message
    );
}

function onleave(message) {
    broadcast.push(
        message
    );
    delete clients[message.id];
}

function send(id, message) {
    clients.get(id).send(
        JSON.stringify(
            message
        )
    )
}

// RANDOM NAME FOR PLAYER

function makeid(length = 5) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
