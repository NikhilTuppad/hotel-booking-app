import axios from 'axios';

export const getWishlist = () => axios.get('/wishlist');
export const toggleWishlist = (placeId) => axios.post('/wishlist/toggle', { placeId });
