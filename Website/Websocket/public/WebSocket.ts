const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
    console.log(event.data);
    try {
        const message = JSON.parse(event.data);
        handleInputMessage(message);
    }    catch (e) {
        handleNotificationMessage(event.data);
    }
};

function handleInputMessage(input: Input) {
    addRowToTable(input);
}

function handleNotificationMessage(notification: string) {
    console.log(notification);
}


function addRowToTable(input: Input) {
    const tableBody = document.querySelector('#inputTable tbody') as HTMLTableElement;
    const row = document.createElement('tr') as HTMLTableRowElement;
    row.innerHTML = `
                <td>${input.deviceId}</td>
                <td>${input.inputDeviceId}</td>
                <td>${input.direction}</td>
            `;
    tableBody.appendChild(row);
}

interface Input {
    deviceId: string | null;
    inputDeviceId: string | null;
    direction: string;
}