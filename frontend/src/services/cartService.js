import api from './api';

export const getCart = async () => { const { data } = await api.get('/cart'); return data; };
export const addToCart = async (body) => { const { data } = await api.post('/cart', body); return data; };
export const updateItem = async (itemId, quantity) => { const { data } = await api.patch(`/cart/${itemId}`, { quantity }); return data; };
export const removeItem = async (itemId) => { const { data } = await api.delete(`/cart/${itemId}`); return data; };
export const clearCart = async () => { const { data } = await api.delete('/cart'); return data; };
