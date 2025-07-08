const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
function setTheme(mode) {
  if (mode === 'light') {
    document.body.classList.add('light');
    themeIcon.innerHTML = `<circle cx="16" cy="16" r="10" stroke="currentColor" stroke-width="3"/>
      <path d="M16 2v4M16 26v4M2 16h4M26 16h4M6.34 6.34l2.83 2.83M22.83 22.83l2.83 2.83M6.34 25.66l2.83-2.83M22.83 9.17l2.83-2.83" stroke="currentColor" stroke-width="2"/>`;
  } else {
    document.body.classList.remove('light');
    themeIcon.innerHTML = `<circle cx="16" cy="16" r="10" stroke="currentColor" stroke-width="3" fill="#0033ff"/>
      <path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0z" fill="#00ffb3"/>
      <path d="M16 2v4M16 26v4M2 16h4M26 16h4" stroke="currentColor" stroke-width="2" opacity="0.3"/>`;
  }
  localStorage.setItem('theme', mode);
}
if (themeToggle && themeIcon) {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
  themeToggle.onclick = () => {
    const isLight = document.body.classList.contains('light');
    setTheme(isLight ? 'dark' : 'light');
  };
}

// --- PARTICLE ANIMATION ---
function spawnParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = Math.random() * 100 + 'vh';
    p.style.animationDelay = (Math.random() * 24) + 's';
    container.appendChild(p);
  }
}
spawnParticles();

// --- CHAT LOGIC ---
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const mediaInput = document.getElementById('media-input');
const voiceBtn = document.getElementById('voice-btn');

sendBtn.onclick = async () => {
  const text = userInput.value.trim();
  if (!text) return;
  appendMessage(text, "user");
  userInput.value = "";
  // Use a public CORS proxy for development (temporary workaround)
  const proxyUrl = "https://corsproxy.io/?";
  const backendUrl = "https://your-backend-url.onrender.com/api/chat";
  try {
    const res = await fetch(proxyUrl + backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    appendMessage(data.reply, "bot");
  } catch (err) {
    appendMessage("[Error: Unable to reach bot server. Please try again later.]", "bot");
    console.error(err);
  }
};

function appendMessage(msg, sender) {
  const msgEl = document.createElement("div");
  msgEl.className = sender + "-msg";
  msgEl.innerText = msg;
  chatBox.appendChild(msgEl);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// --- MEDIA INPUT ---
if (mediaInput) {
  mediaInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    files.forEach(file => {
      appendMessage(`📎 ${file.name}`, 'user');
      // You can add upload logic here
    });
    mediaInput.value = '';
  });
}

// --- VOICE INPUT ---
if (voiceBtn) {
  let recognition;
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    voiceBtn.onclick = () => {
      recognition.start();
      voiceBtn.classList.add('glow');
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      userInput.value = transcript;
      voiceBtn.classList.remove('glow');
    };
    recognition.onend = () => voiceBtn.classList.remove('glow');
    recognition.onerror = () => voiceBtn.classList.remove('glow');
  } else {
    voiceBtn.onclick = () => alert('Voice input not supported in this browser.');
  }
}
