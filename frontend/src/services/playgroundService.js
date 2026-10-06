import api from './api';

export const getPlayground = async () => { const { data } = await api.get('/playground'); return data; };
export const addProduct = async (productId) => { const { data } = await api.post('/playground/products', { productId }); return data; };
export const removeProduct = async (productId) => { const { data } = await api.delete(`/playground/products/${productId}`); return data; };
