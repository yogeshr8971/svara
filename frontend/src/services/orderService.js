import api from './api';

export const createOrder = async (body) => { const { data } = await api.post('/orders', body); return data; };
export const verifyPayment = async (orderId, body) => { const { data } = await api.post(`/orders/${orderId}/verify-payment`, body); return data; };
export const getOrders = async () => { const { data } = await api.get('/orders'); return data; };
export const getOrder = async (id) => { const { data } = await api.get(`/orders/${id}`); return data; };
