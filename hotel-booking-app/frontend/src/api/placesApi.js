import axios from 'axios';

export const createPlace = (data) => axios.post('/places', data);
export const updatePlace = (data) => axios.put('/places', data);
export const getPlaces = () => axios.get('/places');
export const getUserPlaces = () => axios.get('/user-places');
export const getPlaceById = (id) => axios.get(`/places/${id}`);
