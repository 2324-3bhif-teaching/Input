document.addEventListener('DOMContentLoaded', async () => {
   initLogin();
   initInput();
   userID = await fetchRestEndpoint("/authenticated", "GET");
   console.log(userID);
});

let userID;
let loginBTN;
let regBTN;

function initLogin() {
    loginBTN = document.getElementById('login') as HTMLButtonElement;
    regBTN = document.getElementById('register') as HTMLButtonElement;
    
    loginBTN.addEventListener('click', () => {
        window.location.href = 'http://localhost:3000/login';
    });

    regBTN.addEventListener('click', () => {
        window.location.href = 'http://localhost:3000/login';
    });
}

let deviceId: number = -1;
let deviceIdInput;
let submitButton
let devideID;
let controlls1;

function initInput() {
    deviceIdInput = document.getElementById('device-id') as HTMLInputElement;
    devideID = document.getElementById('id-input') as HTMLElement;
    controlls1 = document.getElementById('controlls-1') as HTMLElement;
    submitButton = document.getElementById('id-submit-button') as HTMLButtonElement;


    submitButton.addEventListener('click', () => {
        deviceId = parseInt(deviceIdInput.value);

        if (!isNaN(deviceId)) {
            console.log(`Device ID: ${deviceId}`);
            devideID.style.display = 'none';
            controlls1.style.display = 'block';
        } else {
            deviceIdInput.value = '';
            throw new Error("Invalid ID entered");
        }
    });
}



async function fetchRestEndpoint(route: string, method: "GET" |"POST" |"PUT" |"DELETE", data?: object): Promise<any> {
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