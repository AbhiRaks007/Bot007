const chatBox = document.getElementById("chat-box");

function appendMessage(sender, message) {
  chatBox.innerHTML += `<p><b>${sender}:</b> ${message}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;
  appendMessage("You", message);
  fetch("https://your-backend-url/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  })
    .then(res => res.json())
    .then(data => {
      appendMessage("Bot", data.reply);
      speak(data.reply);
    });
  input.value = "";
}

function handleKey(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
}

function startVoice() {
  const recognition = new webkitSpeechRecognition();
  recognition.onresult = function (event) {
    document.getElementById("userInput").value = event.results[0][0].transcript;
    sendMessage();
  };
  recognition.start();
}

document.getElementById("imageInput").addEventListener("change", function () {
  const file = this.files[0];
  const formData = new FormData();
  formData.append("image", file);

  fetch("https://your-backend-url/image", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => appendMessage("Bot", data.reply));
});

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(speech);
}