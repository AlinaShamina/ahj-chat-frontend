export class Chat {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.ws = null;
    this.user = null;

    this.ui = {
      chatContainer: document.querySelector(".chat"),
      usersContainer: document.querySelector(".users"),
      messagesContainer: document.querySelector("#msgs"),
      input: document.querySelector("#input"),
    };
  }

  async init() {
    const nickname = prompt("Введите ваш никнейм:");
    if (!nickname) return;

    const res = await fetch(`${this.baseUrl}/new-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nickname }),
    });

    const data = await res.json();

    if (data.status === "ok") {
      this.user = data.user;
      this.ui.chatContainer.style.display = "flex"; 
      this.connectWebSocket();
      this.bindEvents();
    } else {
      alert(data.message || "Ошибка регистрации");
      this.init(); 
    }
  }

  connectWebSocket() {
    const wsUrl = this.baseUrl.replace(/^http/, "ws");
    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (Array.isArray(msg)) {
        this.renderUsers(msg);
      } else {
        this.renderMessage(msg);
      }
    };
  }

  bindEvents() {
    this.ui.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && this.ui.input.value.trim()) {
        const message = {
          type: "send",
          message: this.ui.input.value,
          user: this.user,
        };
        this.ws.send(JSON.stringify(message));
        this.ui.input.value = "";
      }
    });

    window.addEventListener("beforeunload", () => {
      if (this.ws && this.user) {
        this.ws.send(JSON.stringify({ type: "exit", user: this.user }));
      }
    });
  }

  renderUsers(users) {
    this.ui.usersContainer.innerHTML = "";
    users.forEach((u) => {
      const div = document.createElement("div");
      div.textContent = u.name === this.user.name ? `${u.name} (You)` : u.name;
      this.ui.usersContainer.appendChild(div);
    });
  }

  renderMessage(msg) {
    const div = document.createElement("div");
    div.textContent = `${msg.user.name === this.user.name ? "You" : msg.user.name}: ${msg.message}`;
    div.style.textAlign = msg.user.name === this.user.name ? "right" : "left";
    this.ui.messagesContainer.appendChild(div);
    this.ui.messagesContainer.scrollTop = this.ui.messagesContainer.scrollHeight;
  }
}
