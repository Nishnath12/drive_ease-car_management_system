import api from './api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // or use AuthService.getToken()
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const LocationService = {
  // Get all locations (Public access)
  getAllLocations: async () => {
    return await api.get('/locations');
  },

  // Get location by ID
  getLocationById: async (id) => {
    return await api.get(`/locations/${id}`);
  },

  // Add location (Supervisor only)
  addLocation: async (locationData) => {
    return await api.post('/locations', locationData, getAuthHeaders());
  },

  // Update location (Supervisor only)
  updateLocation: async (id, locationData) => {
    return await api.put(`/locations/${id}`, locationData, getAuthHeaders());
  },

  // Delete location (Supervisor only)
  deleteLocation: async (id) => {
    return await api.delete(`/locations/${id}`, getAuthHeaders());
  }
};

export default LocationService;
