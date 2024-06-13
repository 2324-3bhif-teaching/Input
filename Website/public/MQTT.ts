import mqtt, {useMQTT} from "mqtt-vue-hook";
import {robot} from "./id-input-script";
import {MqttHook} from "mqtt-vue-hook/dist/hook";


const options = {
    clientId: 'virtualts',
    username: 'mqttDevice',
    password: 'mqttDevice',
};

// @ts-ignore
let mqttHook: MqttHook = new useMQTT();

const client = mqttHook.connect('mqtt://192.168.10.100', options);

//60 - 255
function publishData(data: any) {
    mqttHook.publish('robot/cmnd/virtualtest/drive', JSON.stringify(data));
}

function handleInputs() {
    publishData({ duration: 1, speed: robot.speed, direction: robot.direction });
    console.log("gefahren");
}
