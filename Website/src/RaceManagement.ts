import { Router, json } from "express";

interface Input {
    deviceId: string | null;
    inputDeviceId: string | null;
    direction: string;
}

interface Robot {
    id: string;
    inputDeviceId: number | null;
}

const robots: Robot[] = [
    { id: "robot1", inputDeviceId: null },
    { id: "robot2", inputDeviceId: null },
];

let nextId: number = 1;

export const raceManagementRouter = Router();
raceManagementRouter.use(json());

raceManagementRouter.post('/setInputDeviceId', (req, res) => {
    const { robotId, inputDeviceId }: { robotId: string, inputDeviceId: number | null } = req.body;

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

const findRobotByInputDeviceId = (inputDeviceId: number | null): Robot | undefined => {
    for (const robot of robots) {
        if (robot.inputDeviceId === inputDeviceId) {
            console.log(robot);
            return robot;
        }
    }
};

raceManagementRouter.post('/robotID', (req, res) => {
    const inputDeviceId: number | null  = req.body.inputDeviceId;

    const robot = findRobotByInputDeviceId(inputDeviceId);
    if (!robot) {
        return res.status(204).send("No robot found for the provided inputDeviceId");
    }
    
    res.status(200).json({ robotId: robot.id });
});

raceManagementRouter.get('/inputIdRobot', (req, res) => {
    const temp = nextId;
    nextId += 1;
    res.status(200).send({inputDeviceId: temp});
});

