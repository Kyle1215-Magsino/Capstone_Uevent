import api from './axios';

export const login = (data) => api.post('/login', data);
export const logout = () => api.post('/logout');
export const register = (data) => api.post('/register', data);
export const registerStudent = (data) => api.post('/register-student', data);
export const getUser = () => api.get('/user');
export const getDashboard = () => api.get('/dashboard');
export const getStudentDashboard = () => api.get('/student-dashboard');
export const getStudentAttendance = () => api.get('/student-attendance');
export const getStudentEvents = () => api.get('/student-events');
export const getStudentProfile = () => api.get('/student-profile');
export const updateStudentPassword = (data) => api.put('/student-password', data);
export const uploadProfileImage = (formData) => api.post('/student-profile-image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const uploadUserProfileImage = (formData) => api.post('/user-profile-image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateUserPassword = (data) => api.put('/user-password', data);
export const getUsers = () => api.get('/users');
export const getArchivedUsers = () => api.get('/users/archived');
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const restoreUser = (id) => api.post(`/users/${id}/restore`);
