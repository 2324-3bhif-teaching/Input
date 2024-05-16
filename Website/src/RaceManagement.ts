import { Router } from "express";
import WebSocket from 'ws';

interface Input {
    deviceId: string | null;
    inputDeviceId: string | null;
    direction: string;
}

interface Robot {
    id: string;
    inputDeviceId: string | null;
}

const robots: Robot[] = [
    { id: "robot1", inputDeviceId: null },
    { id: "robot2", inputDeviceId: null },
];

export const raceManagementRouter = Router();

const wss = new WebSocket.Server({ port: 8080 }); // Set your WebSocket server port

wss.on('connection', function connection(ws) {
    console.log('WebSocket client connected');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
});

const findRobot = (deviceId: string | null, inputDeviceId: string | null): Robot | undefined => {
    return robots.find(robot => robot.inputDeviceId === inputDeviceId);
};

raceManagementRouter.post('/input', (req, res) => {
    const input: Input = req.body;

    if (!input.deviceId && !input.inputDeviceId) {
        return res.status(400).send("Invalid input data: deviceId or inputDeviceId must be provided");
    }

    if (!input.direction) {
        return res.status(400).send("Invalid input data: direction is required");
    }

    if (input.deviceId) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(input));
            }
        });
    } else if (input.inputDeviceId) {
        const roboter: Robot | undefined = findRobot(input.deviceId, input.inputDeviceId);
        
        if (roboter) {
            const newInput: Input = {deviceId: roboter.id, inputDeviceId: roboter.inputDeviceId, direction: input.direction};   
        }
        
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(input));
            }
        });
    }
    
    res.status(200).send();
});

raceManagementRouter.post('/setInputDeviceId', (req, res) => {
    const { robotId, inputDeviceId }: { robotId: string, inputDeviceId: string | null } = req.body;

    const robot = robots.find(robot => robot.id === robotId);

    if (!robot) {
        return res.status(404).send("Robot not found");
    }

    robot.inputDeviceId = inputDeviceId;
    res.status(200).send(`Robot ${robot.id} inputDeviceId set to ${inputDeviceId}`);
});

raceManagementRouter.get('/robots', (req, res) => {
    res.status(200).json(robots);
});
