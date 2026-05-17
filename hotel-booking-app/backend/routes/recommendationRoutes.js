const express = require('express');
const router = express.Router();
const { getTrending, getSimilar, getPersonalized, getByIds } = require('../controllers/recommendationController');

router.get('/trending', getTrending);
router.get('/similar/:id', getSimilar);
router.post('/personalized', getPersonalized);
router.post('/by-ids', getByIds);

module.exports = router;
