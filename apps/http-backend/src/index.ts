import express from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./config";
import { middleware } from "./middleware";


const app = express();


app.post("signup", (req, res) => {

    //db call
    res.json({
        userId: 123
    });
    res.send("Signup route");
});

app.post("/signin", (req, res) => {
    const userId = 1;
   const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        token
    })
});

app.post("/room", middleware, (req, res) => {
    
    res.json({
        roomId: 123
    })
});

app.post("/signout", (req, res) => {
    res.send("Signout route");
});



console.log("HTTP server started on port 3001");