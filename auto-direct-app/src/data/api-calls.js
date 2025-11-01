// Environment-based API configuration
const api = process.env.NODE_ENV === 'production' 
  ? 'https://autos-direct.com.au' 
  : 'https://autos-direct.com.au'; // Temporarily pointing to AWS

export default api;