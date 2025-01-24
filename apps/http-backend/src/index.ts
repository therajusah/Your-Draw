
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/signup", async (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        // console.log(parsedData.error);
        res.json({
            message: "Incorrect input`"
        })
        return;
    }
   try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                password: hashedPassword,
                name: parsedData.data.name
            }
        });
        //db call
        res.json({
            userId: user.id
        });
   } catch (error) {
       res.json({
           message: "User already exists"
       })
   }
});

app.post("/signin", async (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect input`"
        })
        return;
    }
    
    const user = await prismaClient.user.findUnique({
        where: {
            email: parsedData.data.username
        }
    });
    if (!user) {
        res.status(403).json({
            message: "Invalid username or password"
        });
        return;
    }
    const passwordMatch = await bcrypt.compare(parsedData.data.password, user.password);
    
    if (!passwordMatch) {
        res.status(403).json({
            message: "Invalid username or password"
        });
        return;
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({
        token
    })
});





app.post("/room", middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "Incorrect input",
        });
        return;
    }
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "User ID is missing or unauthorized" });
        return;
    }
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId,
            },
        });
        res.status(201).json({
            roomId: room.id,
        });
    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({
            message: "Failed to create room, Room already exist with this name",
        });
    }
});

app.post("/signout", (req, res) => {
    res.send("Signout route");
});

app.listen(3001, () => {
    console.log("HTTP server started on port 3001");
});

