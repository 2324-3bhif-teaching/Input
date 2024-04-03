let deviceId: number = -1;
let deviceIdInput;
let submitButton
let devideID;
let controlls1;

export function initInput() {
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
