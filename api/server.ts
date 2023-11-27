import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let existingSignal: { socketId: string, signal: any } | undefined;

io.on("connection", (socket) => {
    socket.on("join", signal => {
        if (!existingSignal) {
            console.log("Joined with empty");
            existingSignal = { socketId: socket.id, signal };
        } else {
            console.log("Joined as second");
            socket.emit("connect-video", existingSignal.signal);
        }
    });

    socket.on("disconnect", () => {
        console.log("disconnect");
        if (existingSignal && existingSignal.socketId === socket.id) {
            console.log("disconnect owner");
            existingSignal = undefined;
        }
    });
});

app.use(express.static("./build"));

server.listen(3000, () => console.log("Server has been started on port 3000"));