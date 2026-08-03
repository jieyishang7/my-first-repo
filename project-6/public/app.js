import {initializeApp} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import {
  getFunctions,
  httpsCallable
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-functions.js";
import {firebaseConfig} from "./firebase-config.js";

const form = document.querySelector("#chat-form");
const input = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const messagesElement = document.querySelector("#messages");
const statusElement = document.querySelector("#status");
const connectionElement = document.querySelector("#connection");
const clearButton = document.querySelector("#clear-button");

let user = null;
let unsubscribeMessages = null;

if (Object.values(firebaseConfig).some((value) => value.startsWith("YOUR_"))) {
  setStatus("Add your Firebase web configuration in firebase-config.js.", true);
  connectionElement.textContent = "Setup required";
} else {
  startFirebase();
}

async function startFirebase() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app);
  const chat = httpsCallable(functions, "chat");
  const clearChat = httpsCallable(functions, "clearChat");

  onAuthStateChanged(auth, async (nextUser) => {
    if (!nextUser) {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error(error);
        setStatus("Enable Anonymous sign-in in Firebase Authentication.", true);
      }
      return;
    }

    user = nextUser;
    sendButton.disabled = false;
    connectionElement.textContent = "Firebase online";
    connectionElement.dataset.state = "online";
    setStatus("Private session ready.");
    subscribeToMessages(db, user.uid);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message || !user) return;

    input.value = "";
    sendButton.disabled = true;
    setStatus("Studio Critic is reviewing…");

    try {
      await chat({message});
      setStatus("Private session ready.");
    } catch (error) {
      console.error(error);
      setStatus(friendlyError(error), true);
      input.value = message;
    } finally {
      sendButton.disabled = false;
      input.focus();
    }
  });

  clearButton.addEventListener("click", async () => {
    if (!user || !window.confirm("Delete this conversation from Firebase?")) return;
    clearButton.disabled = true;
    try {
      await clearChat();
      setStatus("Conversation cleared.");
    } catch (error) {
      console.error(error);
      setStatus("Could not clear the conversation.", true);
    } finally {
      clearButton.disabled = false;
    }
  });
}

function subscribeToMessages(db, userId) {
  if (unsubscribeMessages) unsubscribeMessages();
  const messagesQuery = query(
      collection(db, "users", userId, "messages"),
      orderBy("createdAt", "asc"),
      limit(100)
  );

  unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
    messagesElement.innerHTML = "";
    if (snapshot.empty) {
      renderMessage("assistant", "What are you designing, and which decision feels least resolved?");
    } else {
      snapshot.forEach((message) => {
        const data = message.data();
        if (data.status !== "failed") renderMessage(data.role, data.text);
      });
    }
    messagesElement.scrollTop = messagesElement.scrollHeight;
  }, (error) => {
    console.error(error);
    setStatus("Could not load Firebase history.", true);
  });
}

function renderMessage(role, text) {
  const article = document.createElement("article");
  article.className = `message ${role === "user" ? "user" : "assistant"}`;

  const label = document.createElement("p");
  label.className = "label";
  label.textContent = role === "user" ? "You · On the floor" : "Studio Critic · Online";

  const content = document.createElement("p");
  content.textContent = text;
  article.append(label, content);
  messagesElement.append(article);
}

function setStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.style.color = isError ? "#a63d2f" : "";
}

function friendlyError(error) {
  if (error.code === "functions/resource-exhausted") return "Rate limit reached. Try again in one minute.";
  if (error.code === "functions/unauthenticated") return "Your session expired. Refresh the page.";
  return "The critic could not respond. Your text is restored; please try again.";
}

document.querySelectorAll(".prompt").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.textContent;
    input.focus();
  });
});
