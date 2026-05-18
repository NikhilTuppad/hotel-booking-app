import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import { getBookings, cancelBooking } from "../api/bookingsApi.js";
import AddressLink from "../components/ui/AddressLink.jsx";
import PlaceGallery from "../components/place/PlaceGallery.jsx";
import { toastPromise } from "../utils/toast.js";
import InvoicePreview from "../components/booking/InvoicePreview.jsx";
import { generateInvoicePDF } from "../utils/pdfGenerator.js";
import { Download, Ban } from "lucide-react";

export default function BookingPage() {
  const {id} = useParams();
  const [booking,setBooking] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      getBookings().then(response => {
        const foundBooking = response.data.find(({_id}) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return '';
  }

  async function handleCancelBooking() {
    try {
      await toastPromise(
        cancelBooking(booking._id),
        "Cancelling booking...",
        "Booking cancelled successfully!",
        "Failed to cancel booking."
      );
      window.location.reload();
    } catch (err) {
      // Error handled by toast
    }
  }

  async function handleDownloadPDF() {
    setIsDownloading(true);
    try {
      await toastPromise(
        generateInvoicePDF("invoice-capture", `HotelBazaar_Invoice_${booking._id.substring(0,8)}.pdf`),
        "Generating high-resolution PDF...",
        "Invoice downloaded successfully!",
        "Failed to generate PDF."
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="my-8 max-w-5xl mx-auto px-4 md:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">{booking.place.title}</h1>

      <div className="mb-10 mt-6">
        <PlaceGallery place={booking.place} />
      </div>

      <div className="mb-8">
        <InvoicePreview booking={booking} />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end mb-12">
        {booking.status !== 'cancelled' && (
          <button
            onClick={handleCancelBooking}
            className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-6 py-3.5 rounded-xl font-bold transition-colors shadow-sm"
          >
            <Ban className="w-5 h-5" />
            Cancel Reservation
          </button>
        )}
        
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          {isDownloading ? "Generating..." : "Download Invoice PDF"}
        </button>
      </div>

    </div>
  );
}