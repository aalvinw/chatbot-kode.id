const API_KEY = "AIzaSyC5VqllivcBtjr33IF7u3dS3OhFYVuWD50";

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage("user", userMessage);
  input.value = "";

  const botResponse = await getGeminiResponse(userMessage);
  addMessage("bot", botResponse);
}

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function getGeminiResponse(userText) {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${API_KEY}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: userText }]
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      return "⚠️ " + data.error.message;
    } else {
      return "🤖 AI tidak memberikan jawaban.";
    }
  } catch (err) {
    console.error("Fetch error:", err);
    return "🚨 Gagal menghubungi Gemini API.";
  }
}
