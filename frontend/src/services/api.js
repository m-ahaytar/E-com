import { API_BASE_URL } from '../config';

const resolveEndpoint = (endpoint) => (
  endpoint.startsWith('/') ? endpoint : `/${endpoint}`
);

const buildHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  // On ajoute le token automatiquement si l'utilisateur est connecte.
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const handleUnauthorized = (status) => {
  // Meme comportement que l'ancienne gestion centralisee des erreurs 401.
  if (status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};

const FETCH_TIMEOUT = 1500;

export const request = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${resolveEndpoint(endpoint)}`, {
      ...options,
      signal: controller.signal,
      headers: buildHeaders(options.headers),
    });
  } finally {
    clearTimeout(timeoutId);
  }

  handleUnauthorized(response.status);

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await parseJsonSafely(response) : await response.text();

  if (!response.ok) {
    const errorMessage =
      (isJson && payload?.message) ||
      (typeof payload === "string" && payload) ||
      "Erreur API";
    throw new Error(errorMessage);
  }

  return payload;
};

export const get = (endpoint) => request(endpoint, { method: "GET" });

export const post = (endpoint, body) =>
  request(endpoint, { method: "POST", body: JSON.stringify(body) });

export const put = (endpoint, body) =>
  request(endpoint, { method: "PUT", body: JSON.stringify(body) });

export const del = (endpoint) => request(endpoint, { method: "DELETE" });
