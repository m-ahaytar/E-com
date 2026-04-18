import { post } from "./api";

export const login = async (email, password) => {
  // Appel simple de l'API d'authentification via fetch.
  const data = await post("/auth/login", { email, password });
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
};

export const register = async (userData) => {
  const data = await post("/auth/register", userData);
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  return data;
};
