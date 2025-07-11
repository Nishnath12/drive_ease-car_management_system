import api from './api';

const TestDriveService = {
  bookTestDrive: (data) => api.post('/testdrives', data),
  getAllTestDrives: () => api.get('/testdrives'),
  getTestDrivesByUser: (userId) => api.get(`/testdrives/user/${userId}`),
  updateTestDriveStatus: (id, status) => api.put(`/testdrives/${id}/status`, { status })
};

export default TestDriveService;