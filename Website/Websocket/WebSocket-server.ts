import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const SECRET_TOKEN = 'JUUUUUDGGGYYYY';

let specificClient: WebSocket | null = null;

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', (message: string) => {
        try {
            const data = JSON.parse(message);
            if (data.token && data.token === SECRET_TOKEN) {
                specificClient = ws;
                console.log('Specific client authenticated');
                ws.send('Authenticated as the specific client.');
            } else if (specificClient && specificClient.readyState === WebSocket.OPEN) {
                specificClient.send(message.toString());
            }
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        if (ws === specificClient) {
            specificClient = null;
        }
    });

    ws.send('Welcome to the WebSocket server! Please authenticate.');
});

console.log('WebSocket server is running on ws://localhost:8080');
