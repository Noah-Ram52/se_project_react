const baseUrl = "http://localhost:3001";

function checkResponse(res) {
  if (res.ok) return res.json();
  return res
    .json()
    .then((body) => Promise.reject(body.message || `Error: ${res.status}`))
    .catch(() => Promise.reject(`Error: ${res.status}`));
}

function isValidAbsoluteUrl(str) {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (e) {
    return false;
  }
}

function normalizeAvatarUrl(avatar) {
  if (!avatar || typeof avatar !== "string") return null;
  const trimmed = avatar.trim();
  if (isValidAbsoluteUrl(trimmed)) return trimmed;
  // try adding https:// if protocol missing
  if (!/^https?:\/\//i.test(trimmed)) {
    const tryWithProto = `https://${trimmed}`;
    if (isValidAbsoluteUrl(tryWithProto)) return tryWithProto;
  }
  return null;
}

function signup({ name, avatar, email, password }) {
  // client-side validation for avatar URL to avoid server 400
  const normalizedAvatar = normalizeAvatarUrl(avatar);
  if (!normalizedAvatar) {
    return Promise.reject(
      "Invalid avatar URL. Please provide a full URL (e.g. https://example.com/avatar.jpg)."
    );
  }

  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, avatar: normalizedAvatar, email, password }),
  }).then(checkResponse);
}

function signin({ email, password }) {
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
}

// token helpers (do not auto-save tokens on signin; caller may choose to save)
function saveToken(token) {
  try {
    localStorage.setItem("jwt", token);
  } catch (e) {
    // ignore storage errors
  }
}

function getToken() {
  try {
    return localStorage.getItem("jwt");
  } catch (e) {
    return null;
  }
}

function removeToken() {
  try {
    localStorage.removeItem("jwt");
  } catch (e) {
    // ignore
  }
}

export { signup, signin, saveToken, getToken, removeToken, normalizeAvatarUrl };
