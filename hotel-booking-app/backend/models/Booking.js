const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Place'
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  checkIn: {
    type: Date,
    required: true
  },

  checkOut: {
    type: Date,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  // ✅ TOTAL GUESTS
  numberOfGuests: {
    type: Number,
    default: 1,
  },

  // ✅ ADULTS
  adults: {
    type: Number,
    default: 1,
  },

  // ✅ CHILDREN
  children: {
    type: Number,
    default: 0,
  },

  // ✅ MALE GUESTS
  maleGuests: {
    type: Number,
    default: 0,
  },

  // ✅ FEMALE GUESTS
  femaleGuests: {
    type: Number,
    default: 0,
  },

  // ✅ PRICE
  price: Number,

  // ✅ BOOKING STATUS
  status: {
    type: String,
    default: 'booked'
  },

  // ✅ REFUND AMOUNT
  refundAmount: {
    type: Number,
    default: 0
  },

}, {
  timestamps: true
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;