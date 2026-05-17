import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { getBookingsByPlace, createBooking } from "../../api/bookingsApi.js";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import { showError, toastPromise } from "../../utils/toast.js";

// ✅ DATE PICKER
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [maleGuests, setMaleGuests] = useState(0);
  const [femaleGuests, setFemaleGuests] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  const [unavailableDates, setUnavailableDates] = useState([]);
  const [showGuests, setShowGuests] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (!place?._id) return;

    getBookingsByPlace(place._id).then((response) => {
      const dates = [];

      response.data.forEach((booking) => {
        const start = new Date(booking.checkIn);
        const end = new Date(booking.checkOut);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
      });

      setUnavailableDates(dates);
    });
  }, [place]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(checkOut, checkIn);
  }

  useEffect(() => {
    setNumberOfGuests(Number(adults) + Number(children));
  }, [adults, children]);

  async function bookThisPlace() {
    if (!checkIn || !checkOut) {
      showError("Please select dates before reserving.");
      return;
    }

    try {
      const response = await toastPromise(
        createBooking({
          checkIn: checkIn.toISOString().split("T")[0],
          checkOut: checkOut.toISOString().split("T")[0],
          numberOfGuests,
          adults,
          children,
          maleGuests,
          femaleGuests,
          name,
          phone,
          place: place._id,
          price: numberOfNights * place.price,
        }),
        "Processing reservation...",
        "Reservation confirmed!",
        "Booking failed. Try again."
      );

      const bookingId = response.data._id;
      setTimeout(() => setRedirect(`/account/bookings/${bookingId}`), 1500);
    } catch (err) {
      // error handled by toast
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="glass-deep shadow-premium p-6 rounded-2xl border border-white/60">
      {/* PRICE */}
      <div className="mb-4">
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{place.price}</span>
        <span className="text-gray-500 dark:text-gray-400 font-medium"> / night</span>
      </div>

      {/* INPUTS CONTAINER */}
      <div className="border rounded-xl mt-4 overflow-hidden divide-y border-gray-300 dark:border-gray-700 dark:divide-gray-700 bg-transparent">
        {/* DATES */}
        <div className="flex divide-x border-gray-300 dark:border-gray-700 dark:divide-gray-700">
          <div className="flex-1 py-3 px-4 w-1/2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-800 dark:text-gray-300 mb-1">
              Check-in
            </label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => {
                setCheckIn(date);
              }}
              minDate={new Date()}
              excludeDates={unavailableDates}
              placeholderText="Add date"
              className="w-full outline-none bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div className="flex-1 py-3 px-4 w-1/2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-800 dark:text-gray-300 mb-1">
              Check-out
            </label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => {
                setCheckOut(date);
              }}
              minDate={checkIn || new Date()}
              excludeDates={unavailableDates}
              placeholderText="Add date"
              className="w-full outline-none bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* GUESTS TOGGLE */}
        <div 
          className="py-3 px-4 cursor-pointer flex justify-between items-center transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          onClick={() => setShowGuests(!showGuests)}
        >
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-800 dark:text-gray-300 mb-1 cursor-pointer">
              Guests
            </label>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {numberOfGuests} guest{numberOfGuests > 1 ? "s" : ""}
            </div>
          </div>
          {showGuests ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
        </div>
        
        {/* EXPANDABLE GUEST DETAILS */}
        {showGuests && (
          <div className="p-4 bg-white dark:bg-gray-900 flex flex-col gap-4 text-sm border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800 dark:text-gray-200">Adults</span>
              <input type="number" min="1" value={adults} onChange={e => setAdults(e.target.value)} className="w-16 border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white rounded p-1 text-center outline-none focus:ring-1 focus:ring-brand" />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800 dark:text-gray-200">Children</span>
              <input type="number" min="0" value={children} onChange={e => setChildren(e.target.value)} className="w-16 border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white rounded p-1 text-center outline-none focus:ring-1 focus:ring-brand" />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800 dark:text-gray-200">Male Guests</span>
              <input type="number" min="0" value={maleGuests} onChange={e => setMaleGuests(e.target.value)} className="w-16 border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white rounded p-1 text-center outline-none focus:ring-1 focus:ring-brand" />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800 dark:text-gray-200">Female Guests</span>
              <input type="number" min="0" value={femaleGuests} onChange={e => setFemaleGuests(e.target.value)} className="w-16 border border-gray-300 dark:border-gray-600 bg-transparent dark:text-white rounded p-1 text-center outline-none focus:ring-1 focus:ring-brand" />
            </div>
          </div>
        )}
      </div>

      {/* USER DETAILS */}
      {numberOfNights > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          <div>
             <label className="block text-xs font-semibold text-gray-800 dark:text-gray-300 mb-1">Your full name</label>
             <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              className="border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white p-2 rounded-lg w-full outline-none focus:ring-1 focus:border-brand focus:ring-brand transition-shadow"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-800 dark:text-gray-300 mb-1">Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
              className="border border-gray-300 dark:border-gray-700 bg-transparent dark:text-white p-2 rounded-lg w-full outline-none focus:ring-1 focus:border-brand focus:ring-brand transition-shadow"
            />
          </div>
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={bookThisPlace}
        className="w-full mt-4 bg-brand hover:bg-primaryDark text-white py-3.5 rounded-xl font-bold text-[15px] transition-all shadow-md hover:shadow-lg active:scale-[0.98] focus:ring-2 focus:ring-offset-2 focus:ring-brand"
      >
        Reserve
      </button>

      <div className="text-center mt-3 text-sm font-medium text-gray-500">
        You won't be charged yet
      </div>

      {/* TOTAL */}
      {numberOfNights > 0 && (
        <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-between items-center font-bold text-gray-900 dark:text-gray-100 text-lg">
          <span>Total before taxes</span>
          <span>₹{numberOfNights * place.price}</span>
        </div>
      )}
    </div>
  );
}