import api from './api';

export const generateTryOn = async (productIds) => {
  // Accept single ID or array
  const ids = Array.isArray(productIds) ? productIds : [productIds];
  const { data } = await api.post('/virtual-tryon', { productIds: ids });
  return data;
};

export const getGeneration = async (id) => {
  const { data } = await api.get(`/virtual-tryon/${id}`);
  return data;
};
