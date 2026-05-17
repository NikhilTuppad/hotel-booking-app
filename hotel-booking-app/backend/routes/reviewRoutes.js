const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/reviewController');

router.post('/reviews', addReview);
router.get('/reviews/:placeId', getReviews);

module.exports = router;
