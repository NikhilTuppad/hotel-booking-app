import { format } from "date-fns";
import { MapPin, Users, Calendar, CheckCircle, XCircle } from "lucide-react";

export default function InvoicePreview({ booking }) {
  const isCancelled = booking.status === 'cancelled';

  return (
    <div id="invoice-capture" className="glass-deep rounded-[2rem] p-8 md:p-12 border border-white/60 shadow-premium bg-white/90 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-bl-full pointer-events-none"></div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-gray-200 relative z-10">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-1">HotelBazaar</h2>
          <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">Booking Receipt</p>
        </div>
        <div className="mt-4 md:mt-0 text-left md:text-right">
          <p className="text-sm text-gray-500 font-medium mb-1">Invoice ID</p>
          <p className="text-lg font-bold text-gray-900 font-mono">{booking._id.toUpperCase().substring(0, 8)}-{new Date(booking.createdAt).getFullYear()}</p>
          <p className="text-xs text-gray-400 mt-1">Issued: {format(new Date(), 'MMM dd, yyyy')}</p>
        </div>
      </div>

      {/* STATUS BADGE */}
      <div className="mb-8 flex items-center gap-2">
        {isCancelled ? (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-100 text-red-700 font-bold text-sm tracking-wide">
            <XCircle className="w-4 h-4" /> Cancelled
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm tracking-wide">
            <CheckCircle className="w-4 h-4" /> Confirmed
          </span>
        )}
      </div>

      {/* GUEST & PLACE INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
        {/* Billed To */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Billed To</h3>
          <p className="font-bold text-gray-900 text-lg mb-1">{booking.name || "Guest"}</p>
          <p className="text-gray-600 mb-4">{booking.phone || "No phone provided"}</p>
          
          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
            <Users className="w-4 h-4 text-gray-400" />
            <span>{booking.numberOfGuests} Guest{booking.numberOfGuests > 1 ? 's' : ''} total</span>
          </div>
        </div>

        {/* Accommodation */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Accommodation</h3>
          <p className="font-bold text-gray-900 text-lg mb-1">{booking.place?.title || "Accommodation"}</p>
          
          <div className="flex items-start gap-2 text-sm text-gray-600 mb-4 mt-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <span>{booking.place?.address || "Address not provided"}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{format(new Date(booking.checkIn), 'MMM dd')} - {format(new Date(booking.checkOut), 'MMM dd, yyyy')}</span>
          </div>
        </div>
      </div>

      {/* PRICING BREAKDOWN */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden relative z-10">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Description</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-4 px-6 text-sm text-gray-800 font-medium">Reservation Fee (Total Base Price)</td>
              <td className="py-4 px-6 text-sm text-gray-900 font-bold text-right">₹{booking.price}</td>
            </tr>
            {isCancelled && (
              <tr className="bg-red-50/50">
                <td className="py-4 px-6 text-sm text-red-600 font-semibold">Cancellation Refund Applied</td>
                <td className="py-4 px-6 text-sm text-red-600 font-bold text-right">- ₹{booking.refundAmount}</td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-gray-900 text-white">
            <tr>
              <td className="py-5 px-6 font-bold text-lg">Total Paid</td>
              <td className="py-5 px-6 font-black text-xl text-right">₹{isCancelled ? booking.price - booking.refundAmount : booking.price}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* FOOTER */}
      <div className="mt-10 text-center text-xs text-gray-400 font-medium">
        <p>Thank you for choosing HotelBazaar. If you have any questions regarding this invoice, please contact support.</p>
      </div>
    </div>
  );
}
