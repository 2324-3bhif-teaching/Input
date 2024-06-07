import {fetchRestEndpoint} from "./script.js";

export let deviceId: string = "";
let deviceIdInput: HTMLInputElement;
let submitButton: HTMLButtonElement;
let joinButton: HTMLButtonElement
let devideID: HTMLElement;
let controlls1: HTMLElement;
let toggleMode: HTMLInputElement;
let simple: HTMLElement;
let advanced: HTMLElement;
let number: HTMLSpanElement
export let inputDeviceId: number;

const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', (event) => {
    console.log('WebSocket connection opened:', event);
});

socket.addEventListener('message', (event) => {
    console.log('Message from server:', event.data);
});

socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed:', event);
});

socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
});

export function initInput(): void {
    deviceIdInput = document.getElementById('device-id') as HTMLInputElement;
    devideID = document.getElementById('id-input') as HTMLElement;
    controlls1 = document.getElementById('controlls-1') as HTMLElement;
    submitButton = document.getElementById('id-submit-button') as HTMLButtonElement;
    toggleMode = document.getElementById('toggle') as HTMLInputElement;
    simple = document.getElementById('simple') as HTMLElement;
    advanced = document.getElementById('advanced') as HTMLElement;
    simple.style.display = 'block';
    joinButton = document.getElementById('join-button') as HTMLButtonElement;

    toggleMode.addEventListener('change', () => {
        if (simple.style.display === 'block') {
            simple.style.display = 'none';
            advanced.style.display = 'block';
        } else {
            simple.style.display = 'block';
            advanced.style.display = 'none';
        }
    });

    submitButton.addEventListener('click', async () => {
        deviceId = deviceIdInput.value;
        console.log("test");
        number = document.getElementById('number') as HTMLInputElement;
        inputDeviceId = (await fetchRestEndpoint("http://localhost:3000/api/racemanagement/inputIdRobot", "GET")).inputDeviceId;
        number.textContent = inputDeviceId.toString();
        const message = JSON.stringify({inputId: number.textContent});
        socket.send(message);

        if (deviceId) {
            console.log(`Roboter ID: ${deviceId}`);
            devideID.style.display = 'none';
            controlls1.style.display = 'block';
        }
    });

    joinButton.addEventListener('click', async () => {
        number = document.getElementById('number') as HTMLInputElement;
        inputDeviceId = (await fetchRestEndpoint("http://localhost:3000/api/racemanagement/inputIdRobot", "GET")).inputDeviceId;
        number.textContent = inputDeviceId.toString();
        const message = JSON.stringify({ inputId: number.textContent });
        socket.send(message);

        deviceId = await fetchRobotId(inputDeviceId);

        if (deviceId) {
            console.log(`Robot ID: ${deviceId}`);
            devideID.style.display = 'none';
            controlls1.style.display = 'block';
        }
    });


    document.querySelectorAll('.controll-button').forEach(button => {
        const htmlButton = button as HTMLButtonElement;
        htmlButton.addEventListener('mousedown', handleButtonPress);
        htmlButton.addEventListener('mouseup', handleButtonRelease);
    });

    function handleButtonPress(event: MouseEvent): void {
        const button = event.currentTarget as HTMLButtonElement;
        console.log(`${button.id} pressed`);

        const directionMap: { [key: string]: string } = {
            "forward": "front",
            "left": "left",
            "right": "right",
            "backward": "back"
        };

        const direction = directionMap[button.id];
        if (direction) {
            const message = JSON.stringify({ deviceId: deviceId, inputDeviceId: null, direction: direction });
            socket.send(message);
        }
    }

    function handleButtonRelease(event: MouseEvent): void {
        const button = event.currentTarget as HTMLButtonElement;
        console.log(`${button.id} released`);

        const stopDirectionMap: { [key: string]: string } = {
            "forward": "front-stop",
            "left": "left-stop",
            "right": "right-stop",
            "backward": "back-stop"
        };

        const direction = stopDirectionMap[button.id];
        if (direction) {
            const message = JSON.stringify({ deviceId: deviceId, inputDeviceId: null, direction: direction });
            socket.send(message);
        }
    }

    document.querySelectorAll('.control-inputs input').forEach(input => {
        input.addEventListener('input', (event) => {
            console.log(`${(event.target as HTMLInputElement).name}: ${(event.target as HTMLInputElement).value}`);
        });
    });
}

async function fetchRobotId(inputDeviceId: number): Promise<string> {
    const loadingScreen = document.getElementById('loading-screen') as HTMLElement;
    const loadingScreenId = document.getElementById('loading-text-id') as HTMLElement;
    loadingScreen.style.display = 'flex';
    loadingScreenId.innerText = inputDeviceId.toString();
    
    try {
        while (true) {
            try {
                const response = await fetchRestEndpoint("http://localhost:3000/api/racemanagement/robotID", "POST", { inputDeviceId: inputDeviceId });
                console.log(response);
                if (response.robotId) {
                    return response.robotId;
                }
            } catch (error) {
                
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); 
        }
    } finally {
        loadingScreen.style.display = 'none'; 
    }
}
