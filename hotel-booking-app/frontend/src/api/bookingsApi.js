import axios from 'axios';

export const createBooking = (data) => axios.post('/bookings', data);
export const getBookings = () => axios.get('/bookings');
export const getBookingsByPlace = (placeId) => axios.get(`/bookings-by-place/${placeId}`);
export const cancelBooking = (id) => axios.put(`/bookings/${id}/cancel`);
