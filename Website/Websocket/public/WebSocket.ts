import {updateRobotList} from "./script.js";

const ws = new WebSocket('ws://localhost:8080');

interface Input {
    deviceId: string | null;
    inputDeviceId: string | null;
    direction: string;
}

ws.onmessage = (event) => {
    console.log(event.data);
    try {
        const message: Input = JSON.parse(event.data);
        handleInputMessage(message);
        
        if (message.deviceId) {
            updateRobotList(message.deviceId, message.direction);   
        }
    }    catch (e) {
        handleNotificationMessage(event.data);
    }
};

function handleInputMessage(input: Input) {
    console.log(input);
}

function handleNotificationMessage(notification: string) {
    console.log(notification);
}

interface Input {
    deviceId: string | null;
    inputDeviceId: string | null;
    direction: string;
}