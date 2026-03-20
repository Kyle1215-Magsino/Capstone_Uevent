import api from './axios';

export const getStudents = () => api.get('/students');
export const createStudent = (data) => api.post('/students', data);
export const getStudent = (id) => api.get(`/students/${id}`);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const searchStudents = (q) => api.get('/students/search', { params: { q } });
export const saveFaceData = (id, data) => api.post(`/students/${id}/face`, data);
export const getFaceData = () => api.get('/students/faces');
export const getArchivedStudents = () => api.get('/students/archived');
export const restoreStudent = (id) => api.post(`/students/${id}/restore`);
