import { fetchRestEndpoint } from "./script.js";
import {startSettings} from "./settings-script.js";

export let userID: string;
let loginBTN: HTMLButtonElement;
let loginTopBTN: HTMLButtonElement;
let logoutBTN: HTMLButtonElement;
let logoutTopBTN: HTMLButtonElement;
let returnLogoutBTN: HTMLButtonElement;

export async function initLogin() {
    loginBTN = document.getElementById('login') as HTMLButtonElement;
    logoutBTN = document.getElementById('logout') as HTMLButtonElement;
    loginTopBTN = document.getElementById('login-top') as HTMLButtonElement;
    logoutTopBTN = document.getElementById('logout-top') as HTMLButtonElement;
    returnLogoutBTN = document.getElementById('return-logout') as HTMLButtonElement;

    const handleLogin = () => {
        window.location.href = 'http://localhost:3000/login';
    };

    const handleLogout = () => {
        window.location.href = 'http://localhost:3000/logout';
    };

    loginBTN.addEventListener('click', handleLogin);
    loginTopBTN.addEventListener('click', handleLogin);
    logoutBTN.addEventListener('click', handleLogout);
    logoutTopBTN.addEventListener('click', handleLogout);
    returnLogoutBTN.addEventListener('click', handleLogout);

    userID = ((await fetchRestEndpoint("/authenticated", "GET")).userId);

    updateAuthButtons();
    startSettings();
}

function updateAuthButtons() {
    if (userID) {
        loginBTN.style.display = 'none';
        loginTopBTN.style.display = 'none';
        logoutBTN.style.display = 'inline-block';
        logoutTopBTN.style.display = 'inline-block';
    } else {
        loginBTN.style.display = 'inline-block';
        loginTopBTN.style.display = 'inline-block';
        logoutBTN.style.display = 'none';
        logoutTopBTN.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', initLogin);
