const baseUrl = "http://localhost:3001";

function checkResponse(res) {
  if (res.ok) return res.json();
  return res
    .json()
    .then((body) =>
      Promise.reject(body?.message || body || `Error: ${res.status}`)
    )
    .catch(() => Promise.reject(`Error: ${res.status}`));
}

function authorizedFetch(
  path,
  { method = "GET", body, headers = {} } = {},
  token
) {
  const auth =
    token ??
    (() => {
      try {
        return localStorage.getItem("jwt");
      } catch (e) {
        return null;
      }
    })();
  const hdrs = { "Content-Type": "application/json", ...headers };
  if (auth) hdrs.Authorization = `Bearer ${auth}`;
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: hdrs,
    body: body ? JSON.stringify(body) : undefined,
  }).then(checkResponse);
}

/* Items */
function getItems() {
  return fetch(`${baseUrl}/items`).then(checkResponse);
}
function postItems(payload, token) {
  return authorizedFetch("/items", { method: "POST", body: payload }, token);
}
function deleteItems(id, token) {
  return authorizedFetch(`/items/${id}`, { method: "DELETE" }, token);
}

/* Auth / User */
function signUp({ name, avatar, email, password }) {
  return fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, avatar, email, password }),
  }).then(checkResponse);
}
function signIn({ email, password }) {
  return fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(checkResponse);
}
function getUser(token) {
  return authorizedFetch("/users/me", { method: "GET" }, token);
}
function updateUser({ name, avatar }, token) {
  return authorizedFetch(
    "/users/me",
    { method: "PATCH", body: { name, avatar } },
    token
  );
}

//

function addCardLike(id, token) {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

function removeCardLike(id, token) {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

export {
  baseUrl,
  checkResponse,
  authorizedFetch,
  getItems,
  postItems,
  deleteItems,
  signUp,
  signIn,
  getUser,
  updateUser,
  addCardLike,
  removeCardLike,
};
