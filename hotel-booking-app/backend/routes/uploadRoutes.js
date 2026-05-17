const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadByLink, uploadPhotos } = require('../controllers/uploadController');

const photosMiddleware = multer({ dest: 'uploads/' });

router.post('/upload-by-link', uploadByLink);
router.post('/upload', photosMiddleware.array('photos', 100), uploadPhotos);

module.exports = router;
