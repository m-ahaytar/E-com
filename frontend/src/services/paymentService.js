import { get, post } from "./api";

export const processPayment = async (paymentData) => {
  return post("/payments/process", paymentData);
};

export const getPaymentByOrder = async (orderId) => {
  return get(`/payments/order/${orderId}`);
};
