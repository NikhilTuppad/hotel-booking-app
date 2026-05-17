const Place = require('../models/Place');
const Wishlist = require('../models/Wishlist');
const { getUserDataFromReq } = require('../middleware/authMiddleware');

const getTrending = async (req, res) => {
  try {
    const places = await Place.find().sort({ price: -1 }).limit(10);
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending' });
  }
};

const getSimilar = async (req, res) => {
  try {
    const { id } = req.params;
    const targetPlace = await Place.findById(id);
    if (!targetPlace) return res.status(404).json({ error: 'Place not found' });

    const minPrice = targetPlace.price * 0.7;
    const maxPrice = targetPlace.price * 1.3;

    const similarPlaces = await Place.find({
      _id: { $ne: id },
      price: { $gte: minPrice, $lte: maxPrice },
    }).limit(10);

    if (similarPlaces.length < 4) {
       const fallbacks = await Place.find({ _id: { $ne: id } }).sort({ price: -1 }).limit(10 - similarPlaces.length);
       const all = [...similarPlaces, ...fallbacks];
       const unique = Array.from(new Set(all.map(a => a._id.toString())))
        .map(strId => all.find(a => a._id.toString() === strId));
       return res.json(unique);
    }

    res.json(similarPlaces);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch similar' });
  }
};

const getPersonalized = async (req, res) => {
  try {
    let { viewedIds } = req.body;
    if (!Array.isArray(viewedIds)) viewedIds = [];
    
    let wishlistIds = [];
    try {
      const userData = await getUserDataFromReq(req);
      if (userData) {
        const wishlists = await Wishlist.find({ user: userData.id });
        wishlistIds = wishlists.map(w => w.place.toString());
      }
    } catch (e) {
      // Ignored if not logged in
    }

    const allInteractionIds = [...new Set([...viewedIds, ...wishlistIds])];

    if (allInteractionIds.length === 0) {
      const places = await Place.find().sort({ price: -1 }).limit(10);
      return res.json({ places, reason: 'Trending' });
    }

    const interactedPlaces = await Place.find({ _id: { $in: allInteractionIds } });
    if (interactedPlaces.length === 0) {
      const places = await Place.find().sort({ price: -1 }).limit(10);
      return res.json({ places, reason: 'Trending' });
    }

    const avgPrice = interactedPlaces.reduce((sum, p) => sum + p.price, 0) / interactedPlaces.length;
    const minPrice = avgPrice * 0.5;
    const maxPrice = avgPrice * 1.5;

    const recommendations = await Place.find({
      _id: { $nin: allInteractionIds },
      price: { $gte: minPrice, $lte: maxPrice }
    }).limit(10);

    if (recommendations.length < 5) {
      const fallbacks = await Place.find({ _id: { $nin: allInteractionIds } }).sort({ price: -1 }).limit(10 - recommendations.length);
      const all = [...recommendations, ...fallbacks];
      const unique = Array.from(new Set(all.map(a => a._id.toString())))
        .map(strId => all.find(a => a._id.toString() === strId));
      return res.json({ places: unique, reason: 'Based on your history' });
    }

    res.json({ places: recommendations, reason: 'Based on your history' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch personalized' });
  }
};

const getByIds = async (req, res) => {
  try {
    let { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.json([]);
    const places = await Place.find({ _id: { $in: ids } });
    const sortedPlaces = ids.map(id => places.find(p => p._id.toString() === id)).filter(Boolean);
    res.json(sortedPlaces);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch by ids' });
  }
};

module.exports = { getTrending, getSimilar, getPersonalized, getByIds };
