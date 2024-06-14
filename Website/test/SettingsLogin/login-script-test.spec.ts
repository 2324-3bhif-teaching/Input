import {initLogin, updateAuthButtons, userID} from '../../public/scripts/login-script';
import { fetchRestEndpoint } from '../../public/scripts/script';

jest.mock('../../public/scripts/script', () => ({
    fetchRestEndpoint: jest.fn(),
}));

describe('Login Script Tests', () => {
    let mockLoginButton: HTMLButtonElement;
    let mockLogoutButton: HTMLButtonElement;
    let mockLoginTopButton: HTMLButtonElement;
    let mockLogoutTopButton: HTMLButtonElement;
    let mockReturnLogoutButton: HTMLButtonElement | null = null;

    beforeEach(() => {
        document.body.innerHTML = `
            <button id="login"></button>
            <button id="logout"></button>
            <button id="login-top"></button>
            <button id="logout-top"></button>
            <button id="return-logout"></button>
        `;

        mockLoginButton = document.getElementById('login') as HTMLButtonElement;
        mockLogoutButton = document.getElementById('logout') as HTMLButtonElement;
        mockLoginTopButton = document.getElementById('login-top') as HTMLButtonElement;
        mockLogoutTopButton = document.getElementById('logout-top') as HTMLButtonElement;
        mockReturnLogoutButton = document.getElementById('return-logout') as HTMLButtonElement;

        // Clear userID before each test
        // @ts-ignore
        userID = null;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('initLogin function initializes correctly when authenticated', async () => {
        // Mock a successful authentication response
        (fetchRestEndpoint as jest.Mock).mockResolvedValue({ userId: 'test-user-id' });

        // Call initLogin
        await initLogin();

        // Verify that fetchRestEndpoint is called with the correct parameters
        expect(fetchRestEndpoint).toHaveBeenCalledWith('/authenticated', 'GET');

        // Verify that userID is correctly updated
        expect(userID).toBe('test-user-id');

        // Verify that updateAuthButtons is called and updates button display
        expect(mockLoginButton.style.display).toBe('none');
        expect(mockLoginTopButton.style.display).toBe('none');
        expect(mockLogoutButton.style.display).toBe('inline-block');
        expect(mockLogoutTopButton.style.display).toBe('inline-block');
    });

    test('initLogin function initializes correctly when not authenticated', async () => {
        // Mock a failed authentication response
        (fetchRestEndpoint as jest.Mock).mockRejectedValue(new Error('Authentication failed'));

        // Call initLogin
        await initLogin();

        // Verify that fetchRestEndpoint is called with the correct parameters
        expect(fetchRestEndpoint).toHaveBeenCalledWith('/authenticated', 'GET');

        // Verify that userID is null
        expect(userID).toBeNull();

        // Verify that updateAuthButtons is called and updates button display
        expect(mockLoginButton.style.display).toBe('inline-block');
        expect(mockLoginTopButton.style.display).toBe('inline-block');
        expect(mockLogoutButton.style.display).toBe('none');
        expect(mockLogoutTopButton.style.display).toBe('none');
    });

    test('updateAuthButtons function updates button display correctly when authenticated', () => {
        // @ts-ignore
        userID = 'test-user-id';

        updateAuthButtons();

        // Verify button display
        expect(mockLoginButton.style.display).toBe('none');
        expect(mockLoginTopButton.style.display).toBe('none');
        expect(mockLogoutButton.style.display).toBe('inline-block');
        expect(mockLogoutTopButton.style.display).toBe('inline-block');
    });

    test('updateAuthButtons function updates button display correctly when not authenticated', () => {
        // @ts-ignore
        userID = null;

        updateAuthButtons();

        // Verify button display
        expect(mockLoginButton.style.display).toBe('inline-block');
        expect(mockLoginTopButton.style.display).toBe('inline-block');
        expect(mockLogoutButton.style.display).toBe('none');
        expect(mockLogoutTopButton.style.display).toBe('none');
    });
}); 