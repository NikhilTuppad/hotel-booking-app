import axios from 'axios';

export const addReview = (data) => axios.post('/reviews', data);
export const getReviews = (placeId) => axios.get(`/reviews/${placeId}`);
