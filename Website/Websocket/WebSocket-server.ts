import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

export interface inputDevice {
    inputId: string | null,
    socket: WebSocket,
}

const clients: inputDevice[] = [];

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');
    clients.push({inputId: null, socket: ws});
    
    ws.on('message', (message: string) => {
        console.log('Received:', message.toString());

        try {
            const data = JSON.parse(message);
            if (data.inputId) {
                const client = clients.find(c => c.socket === ws);
                if (client) {
                    client.inputId = data.inputId;
                    console.log(`Updated inputDeviceId to: ${data.inputId}`);
                }
            } else {
                console.log("sending");
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(message.toString());
                    }
                });
            }
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        const index = clients.findIndex(a => a.socket === ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });

    ws.send('Welcome to the WebSocket server!');
});


console.log('WebSocket server is running on ws://localhost:8080');
