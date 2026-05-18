const Booking = require('../models/Booking');
const User = require('../models/User');
const { getUserDataFromReq } = require('../middleware/authMiddleware');

const getBookingsByPlace = async (req, res) => {
  const bookings = await Booking.find({
    place: req.params.placeId,
    status: { $ne: 'cancelled' },
  });
  res.json(bookings);
};

const createBooking = async (req, res) => {
  try {
    console.log("[Booking] 1. Request received for new booking.");
    const userData = await getUserDataFromReq(req);
    const {
      place, checkIn, checkOut,
      numberOfGuests, name, phone, price,
    } = req.body;

    const existingBookings = await Booking.find({
      place,
      status: { $ne: 'cancelled' },
      $or: [
        {
          checkIn: { $lt: checkOut },
          checkOut: { $gt: checkIn },
        },
      ],
    });

    if (existingBookings.length > 0) {
      console.log("[Booking] 2. Dates already booked.");
      return res.status(400).json({
        error: "This place is already booked for selected dates",
      });
    }

    const bookingDoc = await Booking.create({
      place, checkIn, checkOut, numberOfGuests, name, phone, price,
      user: userData.id, status: "booked", refundAmount: 0,
    });

    console.log("[Booking] 3. DB saved successfully. Booking ID:", bookingDoc._id);

    // Immediately return success response so frontend gets instant confirmation
    res.json(bookingDoc);
    console.log("[Booking] 4. API Response sent to frontend instantly.");

  } catch (err) {
    console.error("[Booking] Booking Error ❌:", err);
    res.status(500).json('Failed to create booking');
  }
};

const getBookings = async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    res.json(await Booking.find({ user: userData.id }).populate('place'));
  } catch {
    res.status(401).json([]);
  }
};

const cancelBooking = async (req, res) => {
  try {
    console.log(`[Cancellation] 1. Request received for booking ID: ${req.params.id}`);
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      console.log("[Cancellation] 2. Booking not found.");
      return res.status(404).json('Booking not found');
    }
    if (booking.status === 'cancelled') {
      console.log("[Cancellation] 2. Already cancelled.");
      return res.status(400).json('Already cancelled');
    }

    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const diffHours = (checkInDate - now) / (1000 * 60 * 60);

    let refund = 0;
    if (diffHours > 48) refund = booking.price;
    else if (diffHours > 24) refund = booking.price * 0.5;

    booking.status = 'cancelled';
    booking.refundAmount = refund;
    await booking.save();
    console.log("[Cancellation] 3. DB updated successfully.");

    // Immediately return success response for instant cancellation
    res.json({ message: 'Booking cancelled', refundAmount: refund });
    console.log("[Cancellation] 4. API Response sent to frontend instantly.");

  } catch (err) {
    console.error("[Cancellation] Cancellation Error ❌:", err);
    res.status(500).json('Error cancelling booking');
  }
};

module.exports = { getBookingsByPlace, createBooking, getBookings, cancelBooking };
