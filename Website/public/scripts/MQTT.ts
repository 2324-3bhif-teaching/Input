import {robot} from "./id-input-script.js";

const options = {
    clientId: 'virtualts',
    username: 'mqttDevice',
    password: 'mqttDevice',
};


// @ts-ignore
const client = mqtt.connect('mqtt://192.168.10.100', options);

// direction borders = 60 - 255
function publishData(data: any) {
    client.publish('robot/cmnd/virtualtest/drive', JSON.stringify(data));
}

function handleInputs() {
    publishData({ duration: 500, speed: robot.speed, direction: robot.direction });
}

export function startSending() {
    setInterval(handleInputs, 500);    
}
