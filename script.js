const chatBox = document.getElementById("chatBox");

let chatCount = 1;

const API_KEY = "YOUR_OPENROUTER_API_KEY";

async function sendMessage() {

  const input = document.getElementById("userInput");

  const userText = input.value;

  if(userText === "") return;

  // USER MESSAGE

  const userMessage = document.createElement("div");

  userMessage.classList.add("user-msg");

  userMessage.innerText = userText;

  chatBox.appendChild(userMessage);

  saveChats();

  input.value = "";

  // BOT MESSAGE

  const botMessage = document.createElement("div");

  botMessage.classList.add("bot-msg");

  botMessage.innerHTML = `
  <div class="typing">
    <span></span>
    <span></span>
    <span></span>
  </div>
`;

  chatBox.appendChild(botMessage);

  chatBox.scrollTop = chatBox.scrollHeight;

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          model: "openai/gpt-3.5-turbo",

          messages: [
            {
              role: "user",
              content: userText
            }
          ]

        })

      }
    );

    const data = await response.json();

    botMessage.innerText =
      data.choices[0].message.content;

    saveChats();

  }

  catch(error) {

    botMessage.innerText =
      "Error connecting to AI.";

  }

  chatBox.scrollTop = chatBox.scrollHeight;

}

/* ENTER KEY */

document.getElementById("userInput")
.addEventListener("keypress", function(event){

  if(event.key === "Enter"){

    sendMessage();

  }

});

/* SAVE CHAT */

function saveChats() {

  localStorage.setItem(
    "chatData",
    chatBox.innerHTML
  );

}

/* LOAD CHAT */

window.onload = function () {

  const savedChats =
    localStorage.getItem("chatData");

  if(savedChats) {

    chatBox.innerHTML = savedChats;

  }

}

/* NEW CHAT */

function newChat() {

  // Save old chat in sidebar

  const history = document.getElementById("history");

  const chatItem = document.createElement("p");

  chatItem.innerText = "Chat " + chatCount;

  history.prepend(chatItem);

  chatCount++;

  // Clear current chat

  document.getElementById("chatBox").innerHTML = `
    <div class="bot-msg">
      👋 Hello Appu! I'm EduAssist AI.
    </div>
  `;

  localStorage.removeItem("chatData");

}

/* VOICE INPUT */

function startVoice() {

  const recognition =
    new webkitSpeechRecognition();

  recognition.lang = "en-US";

  recognition.onresult = function(event) {

    document.getElementById("userInput").value =
      event.results[0][0].transcript;

  };

  recognition.start();

}

/* THEME TOGGLE */

function toggleTheme() {

  document.body.classList.toggle("light-mode");

}