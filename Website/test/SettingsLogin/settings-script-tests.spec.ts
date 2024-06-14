import { startSettings } from '../../public/scripts/settings-script';
import { fetchRestEndpoint } from '../../public/scripts/script';

jest.mock('../../public/scripts/script', () => ({
    fetchRestEndpoint: jest.fn(),
}));

describe('startSettings function', () => {
    let accelerationInput: HTMLInputElement;
    let maxSpeedInput: HTMLInputElement;
    let steeringInput: HTMLInputElement;
    let modal: HTMLElement;
    let btn: HTMLElement;
    let span: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = `
            <input id="acceleration" type="text">
            <input id="maxSpeed" type="text">
            <input id="steering" type="text">
            <div id="myModal" style="display: none;"></div>
            <button id="openModal"></button>
            <span class="close"></span>
        `;

        accelerationInput = document.getElementById('acceleration') as HTMLInputElement;
        maxSpeedInput = document.getElementById('maxSpeed') as HTMLInputElement;
        steeringInput = document.getElementById('steering') as HTMLInputElement;
        modal = document.getElementById('myModal')!;
        btn = document.getElementById('openModal')!;
        span = document.getElementsByClassName('close')[0] as HTMLElement;

        startSettings();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    const userID = 'some-user-id';

    test('modal opens and closes correctly', () => {
        btn.click();
        expect(modal.style.display).toBe('block');

        span.click();
        expect(modal.style.display).toBe('none');
        
        modal.click();
        expect(modal.style.display).toBe('none');
    });

    test('fetchRestEndpoint is called with correct parameters', () => {
        expect(fetchRestEndpoint).toHaveBeenCalledWith('/api/settings/getSettings', 'POST', { userID });

        expect(fetchRestEndpoint).toHaveBeenCalledWith('/api/settings', 'POST', {
            userID,
            acceleration: 15,
            maxSpeed: 120,
            steering: 6,
        });
    });

    test('settings are fetched and displayed when user is authenticated', async () => {
        (fetchRestEndpoint as jest.Mock).mockResolvedValue({
            acceleration: 10,
            maxSpeed: 100,
            steering: 5,
        });

        await startSettings();

        expect(fetchRestEndpoint).toHaveBeenCalledWith('/api/settings/getSettings', 'POST', { userID });

        expect(accelerationInput.value).toBe('10');
        expect(maxSpeedInput.value).toBe('100');
        expect(steeringInput.value).toBe('5');
    });

    test('settings update correctly when inputs change', async () => {
        (fetchRestEndpoint as jest.Mock).mockResolvedValueOnce({
            acceleration: 10,
            maxSpeed: 100,
            steering: 5,
        });

        await startSettings();

        accelerationInput.value = '15';
        maxSpeedInput.value = '120';
        steeringInput.value = '6';

        accelerationInput.dispatchEvent(new Event('input'));
        maxSpeedInput.dispatchEvent(new Event('input'));
        steeringInput.dispatchEvent(new Event('input'));

        expect(fetchRestEndpoint).toHaveBeenCalledTimes(2); // One for initial fetch, one for update
        expect(fetchRestEndpoint).toHaveBeenCalledWith('/api/settings', 'POST', {
            userID,
            acceleration: 15,
            maxSpeed: 120,
            steering: 6,
        });
    });

    test('handles errors gracefully when fetching settings fails', async () => {
        (fetchRestEndpoint as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch settings'));

        await startSettings();

        expect(fetchRestEndpoint).toHaveBeenCalledWith('/api/settings/getSettings', 'POST', { userID });
        // Add assertions for error handling (e.g., console.error should be called)
    });

    test('handles errors gracefully when saving settings fails', async () => {
        (fetchRestEndpoint as jest.Mock).mockResolvedValueOnce({
            acceleration: 10,
            maxSpeed: 100,
            steering: 5,
        });

        (fetchRestEndpoint as jest.Mock).mockRejectedValueOnce(new Error('Failed to save settings'));

        await startSettings();

        accelerationInput.value = '15';
        maxSpeedInput.value = '120';
        steeringInput.value = '6';

        accelerationInput.dispatchEvent(new Event('input'));
        maxSpeedInput.dispatchEvent(new Event('input'));
        steeringInput.dispatchEvent(new Event('input'));

        // Add assertions for error handling (e.g., console.error should be called)
    });
});
