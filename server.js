const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "/public")));

let users = {};

io.on("connection", (socket) => {
    socket.on("newuser", (username) => {
        users[socket.id] = username;
        socket.broadcast.emit("update", `${username} joined the conversation`);
    });

    socket.on("chat", (message) => {
        socket.broadcast.emit("chat", message);
    });

    socket.on("exituser", () => {
        socket.broadcast.emit("update", `${users[socket.id]} left the conversation`);
        delete users[socket.id];
    });
});

server.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});
