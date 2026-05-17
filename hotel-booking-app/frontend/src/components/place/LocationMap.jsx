import { useState } from "react";
import { MapPin, ExternalLink, MapPinned } from "lucide-react";
import { motion } from "framer-motion";

export default function LocationMap({ address }) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  if (!address || address.trim() === '') {
    return (
      <div className="mb-12">
        <h2 className="font-semibold text-2xl mb-6 text-gray-900 tracking-tight">Where you'll be</h2>
        <div className="glass-deep w-full h-[350px] rounded-[2rem] border border-white/60 shadow-sm flex flex-col items-center justify-center text-center p-6">
          <div className="bg-gray-100 p-4 rounded-full mb-4 shadow-inner">
            <MapPinned className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Location unavailable</h3>
          <p className="text-gray-500 font-light max-w-sm">The host has not provided a valid address for this accommodation.</p>
        </div>
      </div>
    );
  }

  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <div>
          <h2 className="font-semibold text-2xl mb-2 text-gray-900 tracking-tight">Where you'll be</h2>
          <div className="flex items-center gap-1.5 text-gray-600 font-light">
            <MapPin className="w-4 h-4 text-brand" />
            <span>{address}</span>
          </div>
        </div>
        <a 
          href={`https://maps.google.com/?q=${encodedAddress}`}
          target="_blank" 
          rel="noreferrer"
          aria-label="View location on Google Maps in a new tab"
          className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-semibold transition-all active:scale-95 shadow-md hover:shadow-lg text-sm w-full sm:w-auto"
        >
          <span>Get Directions</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="glass-deep relative w-full h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden border border-white/60 shadow-premium">
        {!isMapLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-0">
            <MapPin className="w-10 h-10 text-gray-400 animate-bounce" />
          </div>
        )}
        <iframe 
          title={`Google Map showing location of ${address}`}
          src={mapUrl}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsMapLoaded(true)}
          className={`relative z-10 transition-opacity duration-700 w-full h-full ${isMapLoaded ? 'opacity-100' : 'opacity-0'}`}
        ></iframe>
      </div>
    </motion.div>
  );
}
