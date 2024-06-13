import {initLogin} from "./login-script.js";
import {initInput} from "./id-input-script.js";
import {startSettings} from "./settings-script.js";
import {startSending} from "./MQTT.js";
import {startControlling} from "./controll-robot.js";

document.addEventListener('DOMContentLoaded', async () => {
    initInput();
    await initLogin();
    await startSettings();
    startControlling();
    startSending();
});

export async function fetchRestEndpoint(route: string, method: "GET" |"POST" |"PUT" |"DELETE", data?: object): Promise<any> {
    let options: any = { method };
    if (data) {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(data);
    }
    const res = await fetch(route, options);
    if (!res.ok) {
        const error = new Error(`${method} ${res.url} ${res.status} (${res.statusText})`);
        throw error;
    }
    if (res.status !== 204) {
        return await res.json();
    }
}


