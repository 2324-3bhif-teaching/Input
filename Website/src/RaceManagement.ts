import { Router, json } from "express";
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
raceManagementRouter.use(json());

const findRobot = (deviceId: string | null, inputDeviceId: string | null): Robot | undefined => {
    return robots.find(robot => robot.inputDeviceId === inputDeviceId);
};

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
