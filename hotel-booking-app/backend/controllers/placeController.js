const Place = require('../models/Place');
const { getUserDataFromReq } = require('../middleware/authMiddleware');

const createPlace = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const {
      title, address, addedPhotos, description, price,
      perks, extraInfo, checkIn, checkOut, maxGuests,
    } = req.body;

    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  } catch (err) {
    res.status(401).json('Not authorized');
  }
};

const getUserPlaces = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    res.json(await Place.find({ owner: userData.id }));
  } catch {
    res.status(401).json([]);
  }
};

const getPlaceById = async (req, res) => {
  res.json(await Place.findById(req.params.id));
};

const getPlaces = async (req, res) => {
  res.json(await Place.find());
};

const updatePlace = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const {
      id, title, address, addedPhotos, description,
      perks, extraInfo, checkIn, checkOut, maxGuests, price,
    } = req.body;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos: addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price,
      });
      await placeDoc.save();
      res.json('ok');
    } else {
        res.status(403).json('Forbidden');
    }
  } catch (err) {
    res.status(500).json('Failed to update place');
  }
};

module.exports = { createPlace, getUserPlaces, getPlaceById, getPlaces, updatePlace };
