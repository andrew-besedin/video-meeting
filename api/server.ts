import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer();
const io = new Server(server);

let existingSignal: any;

io.on("connection", (socket) => {
    socket.on("join", signal => {
        // if (!existingSignal) {
        //     existingSignal = signal;
        // } else {
            socket.emit("connect-video", existingSignal);
        // }
    });
});

server.listen(3000);