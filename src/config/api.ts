
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'http://13.126.145.69:5000/api'
  : 'http://localhost:5000/api';

export default API_BASE_URL;
