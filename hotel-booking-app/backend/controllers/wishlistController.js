const Wishlist = require('../models/Wishlist');
const { getUserDataFromReq } = require('../middleware/authMiddleware');

const getWishlist = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const wishlist = await Wishlist.find({ user: userData.id }).populate('place');
    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { placeId } = req.body;

    if (!placeId) {
      return res.status(400).json({ error: 'Place ID is required' });
    }

    const existingEntry = await Wishlist.findOne({ user: userData.id, place: placeId });

    if (existingEntry) {
      await Wishlist.findByIdAndDelete(existingEntry._id);
      return res.json({ message: 'Removed from wishlist', action: 'removed' });
    } else {
      const newEntry = await Wishlist.create({ user: userData.id, place: placeId });
      return res.json({ message: 'Added to wishlist', action: 'added', entry: newEntry });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle wishlist' });
  }
};

module.exports = { getWishlist, toggleWishlist };
