import api from './axios';

export const processCheckin = (data) => api.post('/checkin', data);
export const getLiveAttendance = (eventId) => api.get(`/attendance/live/${eventId}`);
export const getAttendanceLogs = () => api.get('/attendance');
export const getReports = (period = 'all') => api.get('/reports', { params: { period } });
