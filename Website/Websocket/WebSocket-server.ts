import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');
    ws.send(JSON.stringify({ type: 'input', data: { deviceId: '123', inputDeviceId: '456', direction: 'left' } }));

    ws.on('message', (message: string) => {
        console.log('Received:', message);
        
        ws.send(`Server: ${message}`);
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.send('Welcome to the WebSocket server!');
});

console.log('WebSocket server is running on ws://localhost:8080');
