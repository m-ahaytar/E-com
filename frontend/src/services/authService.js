import { get, post } from "./api";

export const login = async (email, password) => {
  // Appel simple de l'API d'authentification via fetch.
  const data = await post("/auth/login", { email, password });
  if (data.token) {
    const user = {
      id: data.id,
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
    };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(user));
  }
  return {
    ...data,
    user: {
      id: data.id,
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  };
};

export const register = async (userData) => {
  const data = await post("/auth/register", userData);
  if (data.token) {
    const user = {
      id: data.id,
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
    };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(user));
  }
  return {
    ...data,
    user: {
      id: data.id,
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  };
};

export const getUsers = async () => {
  return get("/users");
};
