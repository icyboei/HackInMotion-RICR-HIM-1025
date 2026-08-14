/**
 * api.js — Centralized API client
 * Injects JWT Authorization header automatically for every request.
 * Handles common error patterns and provides meaningful messages.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

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
    let errorMessage = `Server error (${res.status})`;
    try {
      const data = await res.json();
      errorMessage = data.message || data.error || errorMessage;
    } catch {
      try {
        const text = await res.text();
        if (text && text.length < 200) errorMessage = text;
      } catch {
        // failed to read text
      }
    }
    const err = new Error(errorMessage);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

function catchNetworkError(err) {
  if (err.name === "TypeError" && err.message === "Failed to fetch") {
    throw new Error("Unable to connect to backend server. Please verify the service is running and accessible.");
  }
  throw err;
}

const api = {
  get: (path, params = {}) => {
    const isAbsolute = BASE_URL.startsWith("http://") || BASE_URL.startsWith("https://");
    const url = isAbsolute
      ? new URL(`${BASE_URL}${path}`)
      : new URL(`${BASE_URL}${path}`, window.location.origin);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    return fetch(url.toString(), { headers: buildHeaders() })
      .then(handleResponse)
      .catch(catchNetworkError);
  },

  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    })
      .then(handleResponse)
      .catch(catchNetworkError),

  delete: (path) =>
    fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: buildHeaders(),
    })
      .then(handleResponse)
      .catch(catchNetworkError),
};

export default api;
