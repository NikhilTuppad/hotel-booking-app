import axios from 'axios';

export const uploadByLink = (link) => axios.post('/upload-by-link', { link });
export const uploadPhotos = (data) => axios.post('/upload', data, {
  headers: {'Content-type': 'multipart/form-data'}
});
