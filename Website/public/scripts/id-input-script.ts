//import { fetchRestEndpoint } from "./script.js';

import {fetchRestEndpoint} from "./script";

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
        number = document.getElementById('number') as HTMLInputElement;
        inputDeviceId = (await fetchRestEndpoint("http://localhost:3000/api/racemanagement/inputIdRobot", "GET")).inputDeviceId;
        number.textContent = inputDeviceId.toString();

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

        deviceId = await fetchRobotId(inputDeviceId);

        robot.deviceid = deviceId;

        if (deviceId) {
            console.log(`Robot ID: ${deviceId}`);
            devideID.style.display = 'none';
            controlls1.style.display = 'block';
        }
    });
}

export async function fetchRobotId(inputDeviceId: number): Promise<string> {
    const loadingScreen = document.getElementById('loading-screen') as HTMLElement;
    const loadingScreenId = document.getElementById('loading-text-id') as HTMLElement;
    loadingScreen.style.display = 'flex';
    loadingScreenId.innerText = inputDeviceId.toString();

    try {
        while (true) {
            try {
                const response = await fetchRestEndpoint("http://localhost:3000/api/racemanagement/robotID", "POST", { inputDeviceId: inputDeviceId });
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
