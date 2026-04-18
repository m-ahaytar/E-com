const defaultHost =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8085`
    : "http://localhost:8085";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  defaultHost;

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

export const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: buildHeaders(options.headers),
  });

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
