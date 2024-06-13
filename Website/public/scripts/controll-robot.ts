import {robot} from "./id-input-script.js";
import {socket} from "./socket.js";

export function startControlling() {

    document.querySelectorAll('.controll-button').forEach(button => {
        const htmlButton = button as HTMLButtonElement;
        htmlButton.addEventListener('mousedown', handleButtonPress);
        htmlButton.addEventListener('mouseup', handleButtonRelease);
    });

    function handleButtonPress(event: MouseEvent): void {
        const button = event.currentTarget as HTMLButtonElement;

        const directionMap: { [key: string]: string } = {
            "forward": "front",
            "left": "left",
            "right": "right",
            "backward": "back",
            "advanced-forward": "front",
            "advanced-left": "left",
            "advanced-right": "right",
            "advanced-backward": "back",
            "advanced-forward-left": "front-left",
            "advanced-forward-right": "front-right",
            "advanced-backward-left": "back-left",
            "advanced-backward-right": "back-right"
        };

        handleInputs(directionMap[button.id]);
        const message = JSON.stringify(robot);
        socket.send(message);
    }

    function handleInputs(command: string) {
        switch (command) {
            case 'front':
                robot.front = true;
                robot.speed = 240;
                break;
            case 'front-stop':
                robot.front = false;
                robot.speed = 0;
                break;
            case 'back':
                robot.back = true;
                robot.speed = 240;
                break;
            case 'back-stop':
                robot.back = false;
                robot.speed = 0;
                break;
            case 'left':
                robot.left = true;
                robot.speed = 240;
                break;
            case 'left-stop':
                robot.left = false;
                robot.speed = 0;
                break;
            case 'right':
                robot.right = true;
                robot.speed = 240;
                break;
            case 'right-stop':
                robot.right = false;
                robot.speed = 0;
                break;
            case 'front-left':
                robot.front = true;
                robot.left = true;
                robot.speed = 240;
                break;
            case 'front-left-stop':
                robot.front = false;
                robot.left = false;
                robot.speed = 0;
                break;
            case 'front-right':
                robot.front = true;
                robot.right = true;
                robot.speed = 240;
                break;
            case 'front-right-stop':
                robot.front = false;
                robot.right = false;
                robot.speed = 0;
                break;
            case 'back-left':
                robot.back = true;
                robot.left = true;
                robot.speed = 240;
                break;
            case 'back-left-stop':
                robot.back = false;
                robot.left = false;
                robot.speed = 0;
                break;
            case 'back-right':
                robot.back = true;
                robot.right = true;
                robot.speed = 240;
                break;
            case 'back-right-stop':
                robot.back = false;
                robot.right = false;
                robot.speed = 0;
                break;
            default:
                robot.speed = 0;
                break;
        }

        robot.direction = 0;

        if (robot.front && robot.left) {
            robot.direction = 315;
        } else if (robot.front && robot.right) {
            robot.direction = 45;
        } else if (robot.back && robot.left) {
            robot.direction = 225;
        } else if (robot.back && robot.right) {
            robot.direction = 135;
        } else if (robot.front) {
            robot.direction = 0;
        } else if (robot.back) {
            robot.direction = 180;
        } else if (robot.left) {
            robot.direction = 270;
        } else if (robot.right) {
            robot.direction = 90;
        }
    }

    function handleButtonRelease(event: MouseEvent): void {
        const button = event.currentTarget as HTMLButtonElement;

        const stopDirectionMap: { [key: string]: string } = {
            "forward": "front-stop",
            "left": "left-stop",
            "right": "right-stop",
            "backward": "back-stop",
            "advanced-forward": "front-stop",
            "advanced-left": "left-stop",
            "advanced-right": "right-stop",
            "advanced-backward": "back-stop",
            "advanced-forward-left": "front-left-stop",
            "advanced-forward-right": "front-right-stop",
            "advanced-backward-left": "back-left-stop",
            "advanced-backward-right": "back-right-stop"
        };

        handleInputs(stopDirectionMap[button.id]);
        const message = JSON.stringify(robot);
        socket.send(message);
    }

    document.querySelectorAll('.control-inputs input').forEach(input => {
        input.addEventListener('input', (event) => {
            console.log(`${(event.target as HTMLInputElement).name}: ${(event.target as HTMLInputElement).value}`);
        });
    });
}