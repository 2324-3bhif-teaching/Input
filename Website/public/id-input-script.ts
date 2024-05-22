import {fetchRestEndpoint} from "./script.js";

let deviceId: string = "";
let deviceIdInput: HTMLInputElement;
let submitButton : HTMLButtonElement;
let devideID : HTMLElement;
let controlls1: HTMLElement;
let toggleMode: HTMLInputElement;
let simple: HTMLElement;
let advanced: HTMLElement;

export function initInput() {
    deviceIdInput = document.getElementById('device-id') as HTMLInputElement;
    devideID = document.getElementById('id-input') as HTMLElement;
    controlls1 = document.getElementById('controlls-1') as HTMLElement;
    submitButton = document.getElementById('id-submit-button') as HTMLButtonElement;
    toggleMode = document.getElementById('toggle') as HTMLInputElement;
    simple = document.getElementById('simple') as HTMLElement;
    advanced = document.getElementById('advanced') as HTMLElement;
    simple.style.display = 'block';


    toggleMode.addEventListener('change', () => {
        if (simple.style.display === 'block') {
            simple.style.display = 'none';
            advanced.style.display = 'block'
        }
        else {
            simple.style.display = 'block';
            advanced.style.display = 'none'
        }
    });

    submitButton.addEventListener('click', () => {
        deviceId = deviceIdInput.value;

        if (true) {
            console.log(`Device ID: ${deviceId}`);
            devideID.style.display = 'none';
            controlls1.style.display = 'block';
        } else {
            
        }
    });

    document.querySelectorAll('.controll-button').forEach(button => {
        const htmlButton = button as HTMLButtonElement;
        htmlButton.addEventListener('mousedown', handleButtonPress);
        htmlButton.addEventListener('mouseup', handleButtonRelease);
    });
    
    async function handleButtonPress(event: MouseEvent) {
        const button = event.currentTarget as HTMLButtonElement;
        console.log(`${button.id} pressed`);

        if (button.id == "forward") {
            await fetchRestEndpoint("api/racemanagement/input", "POST", {deviceId: deviceId, inputDeviceId: "", direction: "front"});
        } else if(button.id == "left") {
            await fetchRestEndpoint("api/racemanagement/input", "POST", {deviceId: deviceId, inputDeviceId: "", direction: "left"});
        } else if(button.id == "right") {
            await fetchRestEndpoint("api/racemanagement/input", "POST", {deviceId: deviceId, inputDeviceId: "", direction: "right"});
        } else if(button.id == "backward") {
            await fetchRestEndpoint("api/racemanagement/input", "POST", {deviceId: deviceId, inputDeviceId: "", direction: "back"});
        }
    }

    async function handleButtonRelease(event: MouseEvent) {
        const button = event.currentTarget as HTMLButtonElement;
        console.log(`${button.id} released`);

        if (button.id == "forward") {
            await fetchRestEndpoint("api/racemanagement/input", "POST", {deviceId: deviceId, inputDeviceId: "", direction: "front-stop"});
        } else if(button.id == "left") {
            await fetchRestEndpoint("api/racemanagement/input", "POST", {deviceId: deviceId, inputDeviceId: "", direction: "left-stop"});
        } else if(button.id == "right") {
            await fetchRestEndpoint("api/racemanagement/input", "POST", {deviceId: deviceId, inputDeviceId: "", direction: "right-stop"});
        } else if(button.id == "backward") {
            await fetchRestEndpoint("api/racemanagement/input", "POST", {deviceId: deviceId, inputDeviceId: "", direction: "back-stop"});
        }
    }

    document.querySelectorAll('.control-inputs input').forEach(input => {
        input.addEventListener('input', (event) => {
            //console.log(`${event.target.name}: ${event.target.value}`);
        });
    });
}

interface Input {
    deviceId: string | null;
    inputDeviceId: string | null;
    direction: string;
}