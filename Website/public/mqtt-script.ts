import mqtt from 'mqtt';
import {deviceId, robot} from "./id-input-script.js";

const client = mqtt.connect('mqtt://test.com');

client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

client.on('error', (err) => {
    console.error('Error occurred in MQTT connection:', err);
});

function publishData(data: any) {
    client.publish('', JSON.stringify(data));
}

function handleInputs() {
    publishData({ duration: 0.5, speed: robot.speed, direction: robot.direction });
}

setInterval(() => {
    if (deviceId !== null) {
        handleInputs();   
        console.log("sended");
    }
}, 500);