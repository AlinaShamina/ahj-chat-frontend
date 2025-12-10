import "./style.css";

import { Chat } from "./chat.js";

const backend = "https://ahj-chat-backend-y89x.onrender.com";

const chat = new Chat(backend);
chat.init();
