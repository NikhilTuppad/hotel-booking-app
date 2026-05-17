const express = require('express');
const router = express.Router();
const { createPlace, getUserPlaces, getPlaceById, getPlaces, updatePlace } = require('../controllers/placeController');

router.post('/places', createPlace);
router.get('/user-places', getUserPlaces); 
router.get('/places/:id', getPlaceById);
router.get('/places', getPlaces);
router.put('/places', updatePlace);

module.exports = router;
