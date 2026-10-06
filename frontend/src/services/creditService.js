import api from './api';

export const getBalance = async () => { const { data } = await api.get('/credits'); return data; };
export const getTransactions = async (params = {}) => { const { data } = await api.get('/credits/transactions', { params }); return data; };
export const getPackages = async () => { const { data } = await api.get('/credits/packages'); return data; };
export const createOrder = async (packageId) => { const { data } = await api.post('/credits/create-order', { packageId }); return data; };
export const verifyPayment = async (body) => { const { data } = await api.post('/credits/verify-payment', body); return data; };
