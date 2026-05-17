const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Place'
  }
}, {
  timestamps: true
});

// Prevent duplicate saves
wishlistSchema.index({ user: 1, place: 1 }, { unique: true });

const WishlistModel = mongoose.model('Wishlist', wishlistSchema);
module.exports = WishlistModel;
