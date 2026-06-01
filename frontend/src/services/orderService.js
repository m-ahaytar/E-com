import { del, get, post, put } from './api';

export const createOrder = async (orderData) => {
  return post('/orders', orderData);
};

export const getUserOrders = async (userId) => {
  return get(`/orders/user/${userId}`);
};

export const getAllOrders = async () => {
  return get('/orders');
};

export const getOrder = async (id) => {
  return get(`/orders/${id}`);
};

export const getOrdersByProducts = async (productIds) => {
  const ids = productIds.join(',');
  return get(`/orders/by-products?productIds=${ids}`);
};

export const getCart = async () => {
  return get('/cart');
};

export const addCartItem = async (itemData) => {
  return post('/cart/items', itemData);
};

export const updateCartItem = async (productId, quantity) => {
  return put(`/cart/items/${productId}`, { quantity });
};

export const removeCartItem = async (productId) => {
  return del(`/cart/items/${productId}`);
};

export const clearCartItems = async () => {
  return del('/cart');
};
