import jwt, { JwtPayload } from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";


const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") || "";
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {

        return;
    }


    if (!decoded || !(decoded as JwtPayload).userId) {
        ws.close();
        return;
    }


    ws.on("error", console.error);

    ws.on("message", function message(data) {
        console.log("received: %s", data);
    });

    ws.send("something");
});

console.log("WS server started on port 8080");
