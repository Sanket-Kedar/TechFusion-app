import api from '../utils/api';

export const paymentService = {
  createPaymentIntent: async (amount) => {
    const response = await api.post('/payment/create-payment-intent', { amount });
    return response.data;
  },

  confirmPayment: async (paymentIntentId) => {
    const response = await api.post('/payment/confirm-payment', { paymentIntentId });
    return response.data;
  },

  getStripeConfig: async () => {
    const response = await api.get('/payment/config');
    return response.data;
  }
};
