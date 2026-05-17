import axios from 'axios';

export const getTrending = () => axios.get('/recommendations/trending');
export const getSimilar = (id) => axios.get(`/recommendations/similar/${id}`);
export const getPersonalized = (viewedIds) => axios.post('/recommendations/personalized', { viewedIds });
export const getByIds = (ids) => axios.post('/recommendations/by-ids', { ids });
