const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendEmail } = require('../utils/mailer');
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
      return res.status(400).json({
        error: "This place is already booked for selected dates",
      });
    }

    const bookingDoc = await Booking.create({
      place, checkIn, checkOut, numberOfGuests, name, phone, price,
      user: userData.id, status: "booked", refundAmount: 0,
    });

    try {
      await sendEmail({
        from: process.env.EMAIL_USER || '"HotelBazaar" <noreply@hotelbazaar.com>',
        to: userData.email,
        subject: 'Booking Confirmed - HotelBazaar',
        html: `
          <h2>Booking Confirmed ✅</h2>
          <p>Your hotel booking has been confirmed successfully.</p>
          <p><strong>Check-In:</strong> ${checkIn}</p>
          <p><strong>Check-Out:</strong> ${checkOut}</p>
          <p><strong>Total Price:</strong> ₹${price}</p>
          <p>Thank you for choosing HotelBazaar 🏨</p>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr);
    }

    res.json(bookingDoc);
  } catch (err) {
    console.error("Booking Error:", err);
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
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json('Booking not found');
    if (booking.status === 'cancelled') return res.status(400).json('Already cancelled');

    const now = new Date();
    const checkInDate = new Date(booking.checkIn);
    const diffHours = (checkInDate - now) / (1000 * 60 * 60);

    let refund = 0;
    if (diffHours > 48) refund = booking.price;
    else if (diffHours > 24) refund = booking.price * 0.5;

    booking.status = 'cancelled';
    booking.refundAmount = refund;
    await booking.save();

    const user = await User.findById(booking.user);
    
    try {
      await sendEmail({
        from: process.env.EMAIL_USER || '"HotelBazaar" <noreply@hotelbazaar.com>',
        to: user.email,
        subject: 'Booking Cancelled - HotelBazaar',
        html: `
          <h2>Booking Cancelled ❌</h2>
          <p>Your booking has been cancelled successfully.</p>
          <p><strong>Refund Amount:</strong> ₹${refund}</p>
          <p>We hope to serve you again.</p>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send cancellation email:", emailErr);
    }

    res.json({ message: 'Booking cancelled', refundAmount: refund });
  } catch (err) {
    console.error("Cancellation Error:", err);
    res.status(500).json('Error cancelling booking');
  }
};

module.exports = { getBookingsByPlace, createBooking, getBookings, cancelBooking };
