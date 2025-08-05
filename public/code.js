(function () {
    const app = document.querySelector(".app");
    const socket = io();
    let uname;

    app.querySelector("#join-user").addEventListener("click", function () {
        let username = app.querySelector("#username").value.trim();
        if (username.length === 0) return;

        socket.emit("newuser", username);
        uname = username;

        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector("#send-message").addEventListener("click", function () {
        let message = app.querySelector("#message-input").value.trim();
        if (message.length === 0) return;

        renderMessage("my", {
            username: uname,
            text: message
        });

        socket.emit("chat", {
            username: uname,
            text: message
        });

        app.querySelector("#message-input").value = "";
    });

    app.querySelector("#exit-chat").addEventListener("click", function () {
        socket.emit("exituser");
        window.location.reload();
    });

    socket.on("update", function (update) {
        renderMessage("update", update);
    });

    socket.on("chat", function (message) {
        renderMessage("other", message);
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        let el = document.createElement("div");

        if (type === "my") {
            el.className = "message my-message";
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>`;
        } else if (type === "other") {
            el.className = "message other-message";
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>`;
        } else if (type === "update") {
            el.className = "update";
            el.innerText = message;
        }

        messageContainer.appendChild(el);
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();
