import {fetchRestEndpoint} from "./script.js";

let userID;
let loginBTN: HTMLButtonElement;
let regBTN: HTMLButtonElement;

export async function initLogin() {
    loginBTN = document.getElementById('login') as HTMLButtonElement;
    regBTN = document.getElementById('register') as HTMLButtonElement;

    loginBTN.addEventListener('click', () => {
        window.location.href = 'http://localhost:3000/login';
    });

    regBTN.addEventListener('click', () => {
        window.location.href = 'http://localhost:3000/login';
    });

    userID = await fetchRestEndpoint("/authenticated", "GET");

    if (userID !== undefined) {
        console.log(userID.userId);
    } else {
        console.log("not logged in");
    }
}