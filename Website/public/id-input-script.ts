import { fetchRestEndpoint } from "./script.js";

export let deviceId: string = "";
let deviceIdInput: HTMLInputElement;
let submitButton: HTMLButtonElement;
let joinButton: HTMLButtonElement;
let devideID: HTMLElement;
let controlls1: HTMLElement;
let toggleMode: HTMLInputElement;
let simple: HTMLElement;
let advanced: HTMLElement;
let number: HTMLSpanElement;
export let inputDeviceId: number;

const socket = new WebSocket('ws://localhost:8080');

interface Robot {
    deviceid: string;
    front: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
    direction: number;
    speed: number;
}

export let robot: Robot = {
    deviceid: deviceId,
    front: false,
    back: false,
    right: false,
    left: false,
    direction: 0,
    speed: 0
};

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
        const message = JSON.stringify({ inputId: number.textContent });
        socket.send(message);

        robot.deviceid = deviceId;

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

        robot.deviceid = deviceId;

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
            "backward": "back",
            "advanced-forward": "front",
            "advanced-left": "left",
            "advanced-right": "right",
            "advanced-backward": "back",
            "advanced-forward-left": "front-left",
            "advanced-forward-right": "front-right",
            "advanced-backward-left": "back-left",
            "advanced-backward-right": "back-right"
        };
        
        handleInputs(directionMap[button.id]);
        const message = JSON.stringify(robot);
        socket.send(message);
    }

    function handleInputs(command: string) {
        switch (command) {
            case 'front':
                robot.front = true;
                robot.speed = 240;
                break;
            case 'front-stop':
                robot.front = false;
                robot.speed = 0;
                break;
            case 'back':
                robot.back = true;
                robot.speed = 240;
                break;
            case 'back-stop':
                robot.back = false;
                robot.speed = 0;
                break;
            case 'left':
                robot.left = true;
                robot.speed = 240;
                break;
            case 'left-stop':
                robot.left = false;
                robot.speed = 0;
                break;
            case 'right':
                robot.right = true;
                robot.speed = 240;
                break;
            case 'right-stop':
                robot.right = false;
                robot.speed = 0;
                break;
            case 'front-left':
                robot.front = true;
                robot.left = true;
                robot.speed = 240;
                break;
            case 'front-left-stop':
                robot.front = false;
                robot.left = false;
                robot.speed = 0;
                break;
            case 'front-right':
                robot.front = true;
                robot.right = true;
                robot.speed = 240;
                break;
            case 'front-right-stop':
                robot.front = false;
                robot.right = false;
                robot.speed = 0;
                break;
            case 'back-left':
                robot.back = true;
                robot.left = true;
                robot.speed = 240;
                break;
            case 'back-left-stop':
                robot.back = false;
                robot.left = false;
                robot.speed = 0;
                break;
            case 'back-right':
                robot.back = true;
                robot.right = true;
                robot.speed = 240;
                break;
            case 'back-right-stop':
                robot.back = false;
                robot.right = false;
                robot.speed = 0;
                break;
            default:
                const speedMatch = command.match(/^speed:\s*(\d+)$/);
                if (speedMatch) {
                    const speedValue = parseInt(speedMatch[1], 10);
                    if (!isNaN(speedValue)) {
                        robot.speed = speedValue;
                    }
                } else {
                    console.error(`Invalid command: ${command}`);
                }
                break;
        }

        robot.direction = 0;

        if (robot.front && robot.left) {
            robot.direction = 315;
        } else if (robot.front && robot.right) {
            robot.direction = 45;
        } else if (robot.back && robot.left) {
            robot.direction = 225;
        } else if (robot.back && robot.right) {
            robot.direction = 135;
        } else if (robot.front) {
            robot.direction = 0; 
        } else if (robot.back) {
            robot.direction = 180;
        } else if (robot.left) {
            robot.direction = 270;
        } else if (robot.right) {
            robot.direction = 90;
        }
    }

    function handleButtonRelease(event: MouseEvent): void {
        const button = event.currentTarget as HTMLButtonElement;
        console.log(`${button.id} released`);

        const stopDirectionMap: { [key: string]: string } = {
            "forward": "front-stop",
            "left": "left-stop",
            "right": "right-stop",
            "backward": "back-stop",
            "advanced-forward": "front-stop",
            "advanced-left": "left-stop",
            "advanced-right": "right-stop",
            "advanced-backward": "back-stop",
            "advanced-forward-left": "front-left-stop",
            "advanced-forward-right": "front-right-stop",
            "advanced-backward-left": "back-left-stop",
            "advanced-backward-right": "back-right-stop"
        };

        handleInputs(stopDirectionMap[button.id]);
        const message = JSON.stringify(robot);
        socket.send(message);
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
                console.error(error);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } finally {
        loadingScreen.style.display = 'none';
    }
}
