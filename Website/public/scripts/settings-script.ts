import { fetchRestEndpoint } from "./script";
import { userID } from "./login-script";

interface Settings {
    acceleration: number;
    maxSpeed: number;
    steering: number;
}

export async function startSettings() {
    const acceleration = document.getElementById('acceleration') as HTMLInputElement;
    const maxSpeed = document.getElementById('maxSpeed') as HTMLInputElement;
    const steering = document.getElementById('steering') as HTMLInputElement;
    const modal: HTMLElement = document.getElementById("myModal")!;
    const btn: HTMLElement = document.getElementById("openModal")!;
    const span: HTMLElement = document.getElementsByClassName("close")[0] as HTMLElement;

    btn.onclick = function () {
        modal.style.display = "block";
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event: MouseEvent) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    if (userID !== null) {
        try {
            const settings: Settings | undefined = await fetchRestEndpoint('/api/settings/getSettings', 'POST', { userID });

            if (settings) {
                acceleration.value = settings.acceleration.toString();
                maxSpeed.value = settings.maxSpeed.toString();
                steering.value = settings.steering.toString();
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    }

    async function updateSettings() {
        if (userID !== null) {
            let accelerationInt: number = Number.parseInt(acceleration.value);
            let maxSpeedInt: number = Number.parseInt(maxSpeed.value);
            let steeringInt: number = Number.parseInt(steering.value);

            try {
                await fetchRestEndpoint('/api/settings', 'POST', {
                    userID: userID,
                    acceleration: accelerationInt,
                    maxSpeed: maxSpeedInt,
                    steering: steeringInt,
                });

                console.log('Settings saved successfully');
            } catch (error) {
                console.error('Error saving settings:', error);
            }
        }
    }

    acceleration.addEventListener('input', updateSettings);
    maxSpeed.addEventListener('input', updateSettings);
    steering.addEventListener('input', updateSettings);

    modal.style.display = "none";
}
