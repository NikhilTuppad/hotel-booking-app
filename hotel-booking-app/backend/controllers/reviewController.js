const Review = require('../models/Review');
const { getUserDataFromReq } = require('../middleware/authMiddleware');

const addReview = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { place, rating, comment } = req.body;
    const review = await Review.create({
      place, rating, comment, user: userData.id,
    });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to add review" });
  }
};

const getReviews = async (req, res) => {
  const reviews = await Review.find({ place: req.params.placeId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(reviews);
};

module.exports = { addReview, getReviews };
