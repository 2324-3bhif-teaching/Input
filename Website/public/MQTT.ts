import {robot} from "./id-input-script.js";

const options = {
    clientId: 'virtualts',
    username: 'mqttDevice',
    password: 'mqttDevice',
};


// @ts-ignore
const client = mqtt.connect('mqtt://192.168.10.100', options);

//60 - 255
function publishData(data: any) {
    client.publish('robot/cmnd/virtualtest/drive', JSON.stringify(data));
}

function handleInputs() {
    publishData({ duration: 250, speed: robot.speed, direction: robot.direction });
    console.log("gefahren");
}

export function startSending() {
    setInterval(handleInputs, 250);    
}
