import { initInput, fetchRobotId } from '../../public/scripts/id-input-script';
import { fetchRestEndpoint } from '../../public/scripts/script';

jest.mock('../../public/scripts/script', () => ({
    fetchRestEndpoint: jest.fn(),
}));

jest.mock('../../public/scripts/id-input-script', () => {
    const originalModule = jest.requireActual('../../public/scripts/id-input-script');
    return {
        ...originalModule,
        fetchRobotId: jest.fn(),
    };
});

describe('id-input-script tests', () => {
    let mockSocket: WebSocket;
    let mockSocketEvents: { [event: string]: Function };

    beforeEach(() => {
        mockSocketEvents = {};
        mockSocket = {
            addEventListener: jest.fn((event, cb) => {
                mockSocketEvents[event] = cb;
            }),
            send: jest.fn(),
        } as any;
        // @ts-ignore
        global.WebSocket = jest.fn(() => mockSocket);

        document.body.innerHTML = `
      <input id="device-id" type="text">
      <button id="id-submit-button"></button>
      <button id="join-button"></button>
      <div id="id-input"></div>
      <div id="controlls-1"></div>
      <input id="toggle" type="checkbox">
      <div id="simple"></div>
      <div id="advanced"></div>
      <span id="number"></span>
      <div id="loading-screen" style="display: none;"></div>
      <div id="loading-text-id"></div>
    `;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('initInput function initializes correctly', async () => {
        (fetchRestEndpoint as jest.Mock).mockResolvedValue({ inputDeviceId: 123 });
        (fetchRobotId as jest.Mock).mockResolvedValue('mock-robot-id');

        initInput();

        const toggleMode = document.getElementById('toggle') as HTMLInputElement;
        toggleMode.checked = true;
        toggleMode.dispatchEvent(new Event('change'));

        const submitButton = document.getElementById('id-submit-button') as HTMLButtonElement;
        const deviceIdInput = document.getElementById('device-id') as HTMLInputElement;
        deviceIdInput.value = 'test-device-id';
        submitButton.dispatchEvent(new Event('click'));

        // Wait for async operations to complete
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(fetchRestEndpoint).toHaveBeenCalledWith(
            'http://localhost:3000/api/racemanagement/inputIdRobot',
            'GET'
        );

        const joinButton = document.getElementById('join-button') as HTMLButtonElement;
        joinButton.dispatchEvent(new Event('click'));

        // Wait for async operations to complete
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(fetchRestEndpoint).toHaveBeenCalledWith(
            'http://localhost:3000/api/racemanagement/inputIdRobot',
            'GET'
        );

        // Wait for fetchRobotId to be called
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(fetchRobotId).toHaveBeenCalledWith(123); // Ensure fetchRobotId is called with the mocked inputDeviceId
    });

    test('WebSocket events are set up correctly', () => {
        initInput();

        // Check WebSocket open event listener
        expect(mockSocket.addEventListener).toHaveBeenCalledWith('open', expect.any(Function));

        // Check WebSocket message event listener
        expect(mockSocket.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));

        // Check WebSocket close event listener
        expect(mockSocket.addEventListener).toHaveBeenCalledWith('close', expect.any(Function));

        // Check WebSocket error event listener
        expect(mockSocket.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    });
});
