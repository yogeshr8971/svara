import api from './api';

export const getStats = async () => { const { data } = await api.get('/admin/stats'); return data; };
export const getUsers = async (params = {}) => { const { data } = await api.get('/admin/users', { params }); return data; };
export const updateUserRole = async (id, role) => { const { data } = await api.patch(`/admin/users/${id}/role`, { role }); return data; };
export const getVtoGenerations = async (params = {}) => { const { data } = await api.get('/admin/vto', { params }); return data; };
export const getCreditTransactions = async (params = {}) => { const { data } = await api.get('/admin/transactions', { params }); return data; };
export const getAdminPackages = async () => { const { data } = await api.get('/admin/packages'); return data; };
export const createPackage = async (body) => { const { data } = await api.post('/admin/packages', body); return data; };
export const updatePackage = async (id, body) => { const { data } = await api.put(`/admin/packages/${id}`, body); return data; };
export const getCategories = async () => { const { data } = await api.get('/categories'); return data; };
export const createCategory = async (formData) => { const { data } = await api.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); return data; };
