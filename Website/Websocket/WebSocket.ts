import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    console.log('Connected to WebSocket server');
    
    ws.send('Hello, WebSocket server!');
});

ws.on('message', (message: string) => {
    console.log(`Received message from WebSocket server: ${message}`);
});
ws.on('close', () => {
    console.log('Connection to WebSocket server closed');
});
