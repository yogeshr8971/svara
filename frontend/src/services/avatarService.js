import api from './api';

export const uploadAvatar = async (formData) => {
  const { data } = await api.post('/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
};
export const getAvatar = async () => { const { data } = await api.get('/avatar'); return data; };
export const updateAvatar = async (imageUrl) => { const { data } = await api.patch('/avatar', { imageUrl }); return data; };
export const deleteAvatar = async () => { const { data } = await api.delete('/avatar'); return data; };
