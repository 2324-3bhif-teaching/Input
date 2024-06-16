import {json, Router} from "express";
import {fetchCurrentSettings, saveSettings} from "./db";

export const settingsRouter = Router();
settingsRouter.use(json());

settingsRouter.post('/getSettings', async (req, res) => {
    const { userID } = req.body;
    console.log(userID);
    try {
        const settings = await fetchCurrentSettings(userID);
        if (settings) {
            res.json(settings);
        } else {
            res.status(404).json({ error: 'Settings not found' });
        }
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

settingsRouter.post('/', async (req, res) => {
    const { userID, acceleration, maxSpeed, steering } = req.body;
    console.log(userID, acceleration, maxSpeed, steering);
    if (!userID) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        await saveSettings(userID, acceleration, maxSpeed, steering);
        res.json({ message: 'Settings saved successfully' });
    } catch (err) {
        console.error('Error saving settings:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
