import { get, post } from "./api";

export const createOrder = async (orderData) => {
  return post("/orders", orderData);
};

export const getUserOrders = async (userId) => {
  return get(`/orders/user/${userId}`);
};

export const getOrder = async (id) => {
  return get(`/orders/${id}`);
};
