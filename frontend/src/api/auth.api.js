const API_URL = "http://localhost:3000";

export async function signUp(name, email, password) {
  const res = await fetch(`${API_URL}/auth/sign-up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  localStorage.setItem("tetherToken", data.data.token);
  localStorage.setItem("tetherUser", JSON.stringify(data.data.user));
}

export async function signIn(email, password) {
  const res = await fetch(`${API_URL}/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  localStorage.setItem("tetherToken", data.data.token);
  localStorage.setItem("tetherUser", JSON.stringify(data.data.user));
}
