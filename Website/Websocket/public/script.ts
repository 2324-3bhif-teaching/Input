async function fetchRestEndpoint(route: string, method: "GET" | "POST" | "PUT" | "DELETE", data?: object): Promise<any> {
    let options: any = { method };
    if (data) {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(data);
    }
    const res = await fetch(route, options);
    if (!res.ok) {
        const error = new Error(`${method} ${route} ${res.status} (${res.statusText})`);
        throw error;
    }
    if (res.status !== 204) {
        return await res.json();
    }
}

interface Robot {
    id: string;
    front: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
    speed: number;
}

const robots: Robot[] = [];

async function loadRobotList(): Promise<void> {
    const fetchedRobots = await fetchRestEndpoint("http://localhost:3000/api/racemanagement/robots", "GET");
    for (const robot of fetchedRobots) {
        robots.push({ id: robot.id, front: false, back: false, left: false, right: false, speed: 0 });
    }

    const robotList = document.getElementById('robot-list') as HTMLUListElement;
    robots.forEach(robot => {
        const li = document.createElement('li');
        li.textContent = `${robot.id} `;

        const button = document.createElement('button');
        button.textContent = 'View Details';
        button.onclick = () => showRobotDetails(robot.id);

        li.appendChild(button);
        robotList.appendChild(li);
    });
}

function showRobotDetails(id: string): void {
    const modal = document.getElementById('robot-modal') as HTMLElement;
    modal.style.display = 'block';
}

function closeModal(): void {
    const modal = document.getElementById('robot-modal') as HTMLElement;
    modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadRobotList();

    const closeButton = document.querySelector('.close-button') as HTMLButtonElement;
    closeButton.addEventListener('click', () => {
        closeModal();
    });
});

export function updateRobotList(robotId: string, command: string): void {
    const robot = robots.find(r => r.id === robotId);
    if (!robot) {
        console.error(`Robot with id ${robotId} not found`);
        return;
    }

    switch (command) {
        case 'front':
            robot.front = true;
            robot.back = false;
            break;
        case 'front-stop':
            robot.front = false;
            break;
        case 'back':
            robot.back = true;
            robot.front = false;
            break;
        case 'back-stop':
            robot.back = false;
            break;
        case 'left':
            robot.left = true;
            robot.right = false;
            break;
        case 'left-stop':
            robot.left = false;
            break;
        case 'right':
            robot.right = true;
            robot.left = false;
            break;
        case 'right-stop':
            robot.right = false;
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
    
    console.log(robots);
}

























const ws = new WebSocket('ws://localhost:8080');

interface Input {
    deviceId: string | null;
    inputDeviceId: string | null;
    direction: string;
}

ws.onmessage = (event) => {
    console.log(event.data);
    try {
        const message: Input = JSON.parse(event.data);
        handleInputMessage(message);

        if (message.deviceId) {
            updateRobotList(message.deviceId, message.direction);
        }
    }    catch (e) {
        handleNotificationMessage(event.data);
    }
};

function handleInputMessage(input: Input) {
    console.log(input);
}

function handleNotificationMessage(notification: string) {
    console.log(notification);
}



interface Input {
    deviceId: string | null;
    inputDeviceId: string | null;
    direction: string;
}