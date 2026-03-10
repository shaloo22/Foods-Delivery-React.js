import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api/',
});


// Automatically add token to headers
API.interceptors.request.use((req) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
    }
    return req;
});

// Global error handling for 401 Unauthorized
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or not authorized -> clear storage and redirect
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;
