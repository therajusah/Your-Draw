
import express from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();


app.post("signup", (req, res) => {
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect input`"
        })
        return;
    }

    prismaClient.user.create({
        data: {
            email: data.data.email,
            password: data.data.password,
            name: data.data.name
        }
    })

    //db call
    res.json({
        userId: 123
    });
});

app.post("/signin", (req, res) => {
    const data = SigninSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect input`"
        })
        return;
    }
    const userId = 1;
    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        token
    })
});

app.post("/room", middleware, (req, res) => {

    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect input`"
        })
        return;
    }
    res.json({
        roomId: 123
    })
});

app.post("/signout", (req, res) => {
    res.send("Signout route");
});



console.log("HTTP server started on port 3001");