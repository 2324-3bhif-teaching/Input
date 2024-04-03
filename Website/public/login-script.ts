let loginBTN;
let regBTN;
let loginWindow;
let regWindow;
export function initLogin() {
    loginBTN = document.getElementById('login') as HTMLButtonElement;
    regBTN = document.getElementById('register') as HTMLButtonElement;
    loginWindow = document.getElementById('login-window') as HTMLElement;
    regWindow = document.getElementById('register-window') as HTMLElement;
    
    loginBTN.addEventListener('click', () => {
        loginWindow.style.display = 'block';
    });    
    
    regBTN.addEventListener('click', () => {
        regWindow.style.display = 'block';
    });
}