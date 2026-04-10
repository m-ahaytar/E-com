import api from './api';

export const processPayment = async (paymentData) => {
  const response = await api.post('/payments/process', paymentData);
  return response.data;
};

export const getPaymentByOrder = async (orderId) => {
  const response = await api.get(`/payments/order/${orderId}`);
  return response.data;
};
