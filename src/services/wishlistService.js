import api from './api';

export const getWishlist = async () => { const { data } = await api.get('/wishlist'); return data; };
export const toggle = async (productId) => { const { data } = await api.post('/wishlist', { productId }); return data; };
export const remove = async (productId) => { const { data } = await api.delete(`/wishlist/${productId}`); return data; };
