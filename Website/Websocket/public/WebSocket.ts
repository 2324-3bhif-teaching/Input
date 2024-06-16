import { updateRobotList } from "./script.js";

const ws = new WebSocket('ws://localhost:8080');
const SECRET_TOKEN = 'JUUUUUDGGGYYYY';

interface Robot {
    deviceid: string;
    front: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
    direction: number;
    speed: number;
}

ws.onopen = () => {
    ws.send(JSON.stringify({ token: SECRET_TOKEN }));
};

ws.onmessage = (event) => {
    console.log(event.data);
    try {
        const message: Robot = JSON.parse(event.data);
        handleInputMessage(message);

        if (message.deviceid) {
            updateRobotList(message.deviceid, message.direction, message.speed);
        }
    } catch (e) {
        handleNotificationMessage(event.data);
    }
};

function handleInputMessage(input: Robot) {
    console.log(input);
}

function handleNotificationMessage(notification: string) {
    console.log(notification);
}
