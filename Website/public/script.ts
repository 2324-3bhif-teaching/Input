document.addEventListener('DOMContentLoaded', async () => {
   initLogin();
   initInput();
   userID = await fetchRestEndpoint("/authenticated", "GET");

   if (userID !== undefined) {
       console.log(userID.userId);
   } else {
       console.log("not logged in");
   }
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
let toggleMode;
let simple;
let advanced;

function initInput() {
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

    document.querySelectorAll('.control-inputs input').forEach(input => {
        input.addEventListener('input', (event) => {
            //console.log(`${event.target.name}: ${event.target.value}`);
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        let intervalId = null;

        function sendSignal(direction) {
            const data = { message: `${direction} button pressed` };

            fetch('http://localhost:3000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

        function startSendingSignal(direction) {
            if (intervalId) return; // If already sending signals, do nothing

            intervalId = setInterval(() => {
                sendSignal(direction);
            }, 500);
        }

        function stopSendingSignal() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }

        const buttons = document.querySelectorAll('.control-button');

        buttons.forEach(button => {
            const direction = button.textContent;

            button.addEventListener('mousedown', function () {
                startSendingSignal(direction);
            });

            button.addEventListener('mouseup', stopSendingSignal);
            button.addEventListener('mouseleave', stopSendingSignal);

            button.addEventListener('touchstart', function () {
                startSendingSignal(direction);
            });

            button.addEventListener('touchend', stopSendingSignal);
            button.addEventListener('touchcancel', stopSendingSignal);
        });

        document.addEventListener('mouseup', stopSendingSignal);
        document.addEventListener('touchend', stopSendingSignal);
        document.addEventListener('touchcancel', stopSendingSignal);
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


