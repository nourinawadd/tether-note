const API = "http://localhost:5000/api"; // Update to your deployed backend URL if needed

function saveToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// Login
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (data.token) {
    saveToken(data.token);
    window.location.href = "dashboard.html";
  } else {
    alert(data.error || "Login failed");
  }
}

// Register
async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  alert(data.message || data.error || "Registration complete");
}

// Create Note
async function createNote() {
  const content = document.getElementById("noteContent").value;
  const releaseDate = document.getElementById("releaseDate").value;

  const now = new Date();
  const selected = new Date(releaseDate);
  if (selected <= now) {
    alert("Please choose a future date (not today or in the past).");
    return;
  }


  const res = await fetch(`${API}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ content, releaseDate }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Note saved!");
    window.location.href = "dashboard.html";
  } else {
    alert(data.error || "Error saving note.");
  }
}

// Get Notes
async function getNotes() {
  const [available, future] = await Promise.all([
    fetch(`${API}/notes`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(res => res.json()),

    fetch(`${API}/notes/future`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    }).then(res => res.json()),
  ]);

  renderNotes("availableNotes", available);
  showFutureSummary(future);
}

// Render available notes
function renderNotes(id, notes) {
  const list = document.getElementById(id);
  if (!list) return;

  list.innerHTML = notes.map(n =>
    `<li class="mb-2 border p-2 rounded">${n.content}<br><small>Opens: ${new Date(n.releaseDate).toLocaleDateString()}</small></li>`
  ).join('');
}

// Show summary for future notes only
function showFutureSummary(futureNotes) {
  if (!futureNotes || futureNotes.length === 0) return;

  const now = new Date();

  const soonest = futureNotes
    .map(n => new Date(n.releaseDate))
    .sort((a, b) => a - b)[0];

  const timeDiffMs = soonest - now;
  if (timeDiffMs <= 0) return;

  const summaryText = `${futureNotes.length} note${futureNotes.length > 1 ? 's' : ''} arriving in ${formatCountdown(timeDiffMs)}`;

  document.getElementById("futureSummaryText").textContent = summaryText;
  document.getElementById("futureSummary").classList.remove("hidden");
}

// Format milliseconds into readable string
function formatCountdown(ms) {
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
}

// Auto-run if on dashboard
if (window.location.pathname.includes("dashboard.html")) {
  getNotes();
}

// Set minimum selectable date to tomorrow
const releaseDateInput = document.getElementById("releaseDate");
if (releaseDateInput) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  releaseDateInput.min = tomorrow.toISOString().split('T')[0];
}

