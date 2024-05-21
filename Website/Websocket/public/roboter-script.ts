import {robots} from "./script";

function goBack() {
    window.history.back();
}

function getQueryParameter(name: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

document.addEventListener('DOMContentLoaded', () => {
    const robotId = getQueryParameter('id');
    const inputDisplay = document.getElementById('robot-id-input') as HTMLInputElement;
    if (robotId) {
        inputDisplay.value = robotId;
    }
    console.log(robots);
});