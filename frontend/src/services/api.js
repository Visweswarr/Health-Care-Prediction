import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

export const diseaseAPI = {
  getAllDiseases: () => api.get('/disease'),
  predictDisease: (data) => api.post('/disease/predict', data),
  predictDiseaseML: (data) => api.post('/disease/predict-ml', data),
  getPredictionHistory: () => api.get('/disease/history/predictions'),
};

export const insuranceAPI = {
  getAllPlans: () => api.get('/insurance/plans'),
  getPlan: (id) => api.get(`/insurance/plans/${id}`),
  calculatePremium: (data) => api.post('/insurance/calculate-premium', data),
  comparePlans: (data) => api.post('/insurance/compare', data),
  getHistory: () => api.get('/insurance/history'),
  addToHistory: (data) => api.post('/insurance/history', data),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getMedicalHistory: () => api.get('/user/medical-history'),
  addMedicalCondition: (data) => api.post('/user/medical-history', data),
  updateMedicalCondition: (id, data) => api.put(`/user/medical-history/${id}`, data),
  deleteMedicalCondition: (id) => api.delete(`/user/medical-history/${id}`),
  getStats: () => api.get('/user/stats'),
};

export const healthCheck = () => api.get('/health');

export default api; 