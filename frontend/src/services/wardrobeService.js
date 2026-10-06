import api from './api';

export const getWardrobe = async (params = {}) => { const { data } = await api.get('/wardrobe', { params }); return data; };
export const getItem = async (id) => { const { data } = await api.get(`/wardrobe/${id}`); return data; };
export const deleteItem = async (id) => { const { data } = await api.delete(`/wardrobe/${id}`); return data; };
export const toggleFavorite = async (id) => { const { data } = await api.patch(`/wardrobe/${id}/favorite`); return data; };
