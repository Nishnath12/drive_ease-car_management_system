import api from './api';

const LocationService = {
  getAllLocations: async () => api.get('/locations'),
  getLocationById: async (id) => api.get(`/locations/${id}`),
  addLocation: async (locationData) => api.post('/locations', locationData),
  updateLocation: async (id, locationData) => api.put(`/locations/${id}`, locationData),
  deleteLocation: async (id) => api.delete(`/locations/${id}`)
};

export default LocationService;
