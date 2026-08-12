/**
 * api.js — Centralized API client
 * Injects JWT Authorization header automatically for every request.
 * Handles common error patterns and provides meaningful messages.
 */

const BASE_URL = "/api";

function getToken() {
  return localStorage.getItem("medsafe_token");
}

function buildHeaders(extra = {}) {
  const headers = { "Content-Type": "application/json", ...extra };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res) {
  if (!res.ok) {
    let errorMessage = "An unexpected error occurred.";
    try {
      const data = await res.json();
      errorMessage = data.message || errorMessage;
    } catch {
      // response wasn't JSON
    }
    const err = new Error(errorMessage);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

const api = {
  get: (path, params = {}) => {
    const url = new URL(`${BASE_URL}${path}`, window.location.origin);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    return fetch(url.toString(), { headers: buildHeaders() }).then(handleResponse);
  },

  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path) =>
    fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: buildHeaders(),
    }).then(handleResponse),
};

export default api;
