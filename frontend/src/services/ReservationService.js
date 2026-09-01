import api from './api';

const ReservationService = {
  getAllReservations: async () => api.get('/reservations'),
  getReservationById: async (id) => api.get(`/reservations/${id}`),
  addReservation: async (reservationData) => api.post('/reservations', reservationData),
  updateReservation: async (id, reservationData) => api.put(`/reservations/${id}`, reservationData),
  deleteReservation: async (id) => api.delete(`/reservations/${id}`),
  getUserReservations: async (userId) => api.get(`/reservations/user/${userId}`)
};

export default ReservationService;
