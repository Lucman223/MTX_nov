import axios from 'axios';

const API_URL = '/api/admin/forfaits';

// Helper to get the token from localStorage
const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
};

// Setup axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const getForfaits = () => {
    return api.get('/');
};

export const createForfait = (forfait) => {
    return api.post('/', forfait);
};

export const updateForfait = (id, forfait) => {
    return api.put(`/${id}`, forfait);
};

export const deleteForfait = (id) => {
    return api.delete(`/${id}`);
};
