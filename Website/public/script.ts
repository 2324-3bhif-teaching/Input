document.addEventListener('DOMContentLoaded', () => {
   initLogin();
   initInput();
});

let loginBTN;
let regBTN;
let loginWindow;
let regWindow;
function initLogin() {
    loginBTN = document.getElementById('login') as HTMLButtonElement;
    regBTN = document.getElementById('register') as HTMLButtonElement;
    loginWindow = document.getElementById('login-window') as HTMLElement;
    regWindow = document.getElementById('register-window') as HTMLElement;
    loginWindow.style.display = 'none';
    regWindow.style.display = 'none';
    
    loginBTN.addEventListener('click', () => {
        if (loginWindow.style.display === 'none') {
            loginWindow.style.display = 'block';
            regWindow.style.display = 'none'
        }
        else {
            loginWindow.style.display = 'none';
            regWindow.style.display = 'none'
        }
    });

    regBTN.addEventListener('click', () => {
        if (regWindow.style.display === 'none') {
            regWindow.style.display = 'block';
            loginWindow.style.display = 'none';
        }
        else {
            regWindow.style.display = 'none';
            loginWindow.style.display = 'none';
        }
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
