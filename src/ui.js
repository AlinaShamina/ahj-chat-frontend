export default class UI {
  constructor() {
    this.app = document.getElementById("app");

    this.app.innerHTML = `
      <div class="chat">
        <div class="users"><h3>Users</h3><div id="users"></div></div>
        <div class="messages">
          <div id="msgs" style="flex-grow:1; overflow-y:auto;"></div>
          <input id="input" placeholder="Введите сообщение">
        </div>
      </div>
    `;

    this.users = document.getElementById("users");
    this.msgs = document.getElementById("msgs");
    this.input = document.getElementById("input");

    this.sendHandler = null;

    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && this.sendHandler) {
        this.sendHandler(this.input.value);
        this.input.value = "";
      }
    });
  }

  updateUsers(users) {
    this.users.innerHTML = users.map(u => `<div>${u.name}</div>`).join("");
  }

  addMessage(type, text, username) {
    const div = document.createElement("div");
    div.className = `msg ${type}`;
    div.innerHTML = `<b>${type === "you" ? "You" : username}:</b> ${text}`;
    this.msgs.appendChild(div);
    this.msgs.scrollTop = this.msgs.scrollHeight;
  }

  onSend(cb) {
    this.sendHandler = cb;
  }
}
