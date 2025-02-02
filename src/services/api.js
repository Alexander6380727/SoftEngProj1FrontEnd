import axios from 'axios';

const api = axios.create({
  baseURL: 'https://softengproj1backend.onrender.com',
});

export default api;
