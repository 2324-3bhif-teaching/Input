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

let robots: Robot[] = [];

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
    const index = robots.findIndex(r => r.id === robotId);
    if (index === -1) {
        console.error(`Robot with id ${robotId} not found`);
        return;
    }

    const robot = robots[index];
    
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
    
    setRotation(robot);
}

function setRotation(robot: Robot) {
    const image = document.getElementById("robot-image") as HTMLImageElement;
    let rotationAngle = 0;

    if (robot.front) {
        rotationAngle = 0;
    } else if (robot.back) {
        rotationAngle = 180;
    } else if (robot.left) {
        rotationAngle = -90;
    } else if (robot.right) {
        rotationAngle = 90;
    }
    
    image.style.transform = `rotate(${rotationAngle}deg)`;
}