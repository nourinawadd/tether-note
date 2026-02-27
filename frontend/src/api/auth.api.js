const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error(
      "Unable to reach the server. Check your backend connection and CORS configuration."
    );
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      payload?.message || `Request failed with status ${response.status}.`
    );
  }

  if (!payload?.success) {
    throw new Error(
      payload?.message || `Request was not successful (status ${response.status}).`
    );
  }

  return payload;
}

function storeSession(data) {
  localStorage.setItem("tetherToken", data.token);
  localStorage.setItem("tetherUser", JSON.stringify(data.user));
}

export async function signUp(name, email, password) {
  const payload = await request("/auth/sign-up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  storeSession(payload.data);
  return payload.data;
}

export async function signIn(email, password) {
  const payload = await request("/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  storeSession(payload.data);
  return payload.data;
}

export async function fetchNotes(token) {
  const payload = await request("/notes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return payload.data;
}

export async function fetchNoteById(token, noteId) {
  const payload = await request(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return payload.data;
}

export async function createNote(token, noteData) {
  const payload = await request("/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noteData),
  });

  return payload.data;
}

export async function deleteNote(token, noteId) {
  await request(`/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateProfile(token, profileData) {
  const payload = await request("/user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  return payload.data;
}

export { API_BASE_URL };
