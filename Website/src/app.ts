import { auth } from "express-openid-connect";
import express from 'express';
import path from "path";
import {raceManagementRouter} from "./RaceManagement";

const app = express();
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'C9fyw3YdyjuuIHDpmX7eYqB88XSJAzDh',
    issuerBaseURL: 'https://dev-sge3qdhuu1llrim6.eu.auth0.com'
};

app.use(auth(config));
app.use("/api/raceManagement", raceManagementRouter);
app.use(express.static(path.join(__dirname, '../public')));

app.get('/authenticated', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        if (req.oidc.user !== undefined) {
            const userId = req.oidc.user.sub;
            console.log("User ID:", userId);
            res.json({ userId: userId });
        }
    } else {
        res.status(204).json({userId: null});
    }
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});