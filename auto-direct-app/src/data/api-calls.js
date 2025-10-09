// Environment-based API configuration
const api = process.env.NODE_ENV === 'production' 
  ? 'https://autos-direct.com.au' 
  : 'http://localhost:3000';

export default api;