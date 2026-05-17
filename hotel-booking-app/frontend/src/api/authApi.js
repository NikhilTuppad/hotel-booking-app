import axios from 'axios';

export const registerUser = (data) => axios.post('/register', data);
export const loginUser = (data) => axios.post('/login', data);
export const logoutUser = () => axios.post('/logout');
export const getProfile = () => axios.get('/profile');
