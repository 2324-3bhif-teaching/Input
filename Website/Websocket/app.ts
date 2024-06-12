import express from "express";

const app = express();

app.use(express.static('./Websocket/public'));

app.listen('3001', () => {
    console.log("started");
});