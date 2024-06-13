function calculateShortestRotation(current: number, target: number): number {
    console.log(target, current);
    let diff = target - current;
    if (target > 180) {
        diff -= 360;
    } else if (diff < -180) {
        diff += 360;
    }
    
    console.log(diff);
    return diff;
}

export function updateRobotList(robotId: string, targetDirection: number, speed: number): void {
    const index = robots.findIndex(r => r.deviceid === robotId);
    if (index === -1) {
        console.error(`Robot with id ${robotId} not found`);
        return;
    }

    const robot = robots[index];
    let currentDirection = robot.currentDirection || 0;
    currentDirection = calculateShortestRotation(currentDirection, targetDirection);
    
    const image = document.getElementById("robot-image") as HTMLImageElement;
    if (image) {
        image.style.transform = `rotate(${currentDirection}deg)`;
    }
    
    updateRobotSpeed(speed);
}

function updateRobotSpeed(speed: number) {
    let speedPercentage = (speed / 260) * 100;
    let speedValue = document.getElementById('speed-value') as HTMLDivElement;
    speedValue.style.height = `${speedPercentage}%`;
}


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
    deviceid: string;
    front: boolean;
    back: boolean;
    left: boolean;
    right: boolean;
    direction: number;
    speed: number;
    currentDirection: number;
}

let robots: Robot[] = [];

async function loadRobotList(): Promise<void> {
    const fetchedRobots = await fetchRestEndpoint("http://localhost:3000/api/racemanagement/robots", "GET");
    for (const robot of fetchedRobots) {
        robots.push({ deviceid: robot.id, front: false, back: false, left: false, right: false, direction: 0, speed: 0, currentDirection: 0 });
    }

    const robotList = document.getElementById('robot-list') as HTMLUListElement;
    robots.forEach(robot => {
        const li = document.createElement('li');
        li.textContent = `${robot.deviceid} `;

        const button = document.createElement('button');
        button.textContent = 'View Details';
        button.onclick = () => showRobotDetails(robot.deviceid);

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
