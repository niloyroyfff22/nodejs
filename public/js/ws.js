let myUserId = null;
let currentUser = null;

const activeList = document.getElementById("activeList");
const chatBox = document.getElementById("chatMessages");

const activeBar = document.getElementById("activeBar");

const ws = new WebSocket(
  (location.protocol === "https:" ? "wss://" : "ws://") + location.host
);

/* =====================
   WS EVENTS
===================== */
ws.onopen = () => console.log("✅ WS Connected");
ws.onerror = (e) => console.error("❌ WS Error", e);
ws.onclose = () => console.log("❌ WS Closed");

ws.onmessage = (e) => {
  try {
    const data = JSON.parse(e.data);

    /* 🔹 INIT */
    if (data.type === "init") {
      myUserId = data.selfId;
      return;
    }

    /* 🔹 USERS LIST */
    if (data.type === "users") {
      if (myUserId !== null) {
        renderUsers(data.users);
        
        renderActiveUsers(data.users); // 🔥 active bar

        // 🔥 realtime status update for open chat
        if (currentUser) {
          const updated = data.users.find(
            u => u.id === currentUser.id
          );
          if (updated) updateChatHeader(updated);
        }
      }
      return;
    }

    /* 🔹 CHAT HISTORY */
    if (data.type === "chat_history") {
      chatBox.innerHTML = "";

      data.messages.forEach(m => {
        addMsg(
          m.message,
          m.from === myUserId ? "me" : "other"
        );
      });

      scrollBottom();
      return;
    }

    /* 🔹 PRIVATE MESSAGE */
    if (data.type === "private_message") {

      // 🔥 only show if this chat is open
      if (currentUser && data.from === currentUser.id) {
        addMsg(data.message, "other");
        scrollBottom();

        // 🔥 immediately mark read (safety)
        ws.send(JSON.stringify({
          type: "mark_read",
          with: data.from
        }));
      }

      return;
    }

  } catch (err) {
    console.error("WS Parse Error", err);
  }
};

/* =====================
   OPEN CHAT
===================== */
function openChat(u) {
  currentUser = u;

  document.getElementById("chatUser").textContent = u.name;
  updateChatHeader(u);

  chatBox.innerHTML = "";
  document.getElementById("chatModal").style.display = "flex";

  // 🔥 load history + mark active
  ws.send(JSON.stringify({
    type: "chat_history",
    with: u.id
  }));

  // 🔥 explicitly mark read
  ws.send(JSON.stringify({
    type: "mark_read",
    with: u.id
  }));
}

/* =====================
   CLOSE CHAT
===================== */
function closeChat() {
  currentUser = null;
  document.getElementById("chatModal").style.display = "none";

  // 🔥 tell server chat closed
  ws.send(JSON.stringify({
    type: "chat_closed"
  }));
}

/* =====================
   UPDATE CHAT HEADER
===================== */
function updateChatHeader(u) {
  const statusEl = document.getElementById("chatStatus");

  if (u.online) {
    statusEl.textContent = "🟢 Online";
  } else {
    statusEl.textContent =
      "Last active " + timeAgo(u.lastSeen);
  }
}

/* =====================
   ACTIVE / RECENT USERS
===================== */
function renderUsers(users) {
  activeList.innerHTML = "";

  users.forEach(u => {
    const li = document.createElement("li");
    li.className = "user-item";

    const isUnread = u.unread && u.unread > 0;

    li.innerHTML = `
      <div class="user-row">
        <span class="user-name ${isUnread ? "bold" : ""}">
          ${u.name}
        </span>
        ${u.online ? `<span class="online-dot"></span>` : ""}
      </div>

      <div class="last-text ${isUnread ? "bold" : ""}">
        ${u.lastText || ""}
        ${isUnread ? `<span class="unread-count">${u.unread}</span>` : ""}
      </div>
    `;

    li.onclick = () => openChat(u);
    activeList.appendChild(li);
  });
}


function renderActiveUsers(users) {
  activeBar.innerHTML = "";

  users
    .filter(u => u.online) // 🔥 only online users
    .forEach(u => {
      const div = document.createElement("div");
      div.className = "active-user";

      div.innerHTML = `
        <img src="https://ui-avatars.com/api/?name=${u.name}&background=random" />
        <span class="online-dot"></span>
        <div class="name">${u.name}</div>
      `;

      div.onclick = () => openChat(u);
      activeBar.appendChild(div);
    });
}
/* =====================
   MESSAGE UI
===================== */
function addMsg(msg, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.textContent = msg;
  chatBox.appendChild(div);
}

/* =====================
   SEND MESSAGE
===================== */
function sendMsg() {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    alert("Connection lost");
    return;
  }

  const input = document.getElementById("msgInput");
  const text = input.value.trim();
  if (!text || !currentUser) return;

  ws.send(JSON.stringify({
    type: "private_message",
    to: currentUser.id,
    message: text
  }));

  addMsg(text, "me");
  input.value = "";
  scrollBottom();
}

/* =====================
   TIME AGO
===================== */
function timeAgo(time) {
  if (!time) return "";

  const diff = Date.now() - time;
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (sec < 60) return "just now";
  if (min < 60) return `${min} min ago`;
  if (hr < 24) return `${hr} hour ago`;
  return `${day} day ago`;
}

/* =====================
   SCROLL
===================== */
function scrollBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}