// axiosConfig.js
const axios = require('axios');

// Create an Axios instance with a global base URL
const apiClient = axios.create({
  baseURL: process.env.BaseUrl, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials to send/receive cookies globally
});

// Optional: Set up interceptors for requests and responses (if needed)
apiClient.interceptors.request.use(
  (config) => {
    // Add common headers or configurations here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

module.exports = apiClient;
