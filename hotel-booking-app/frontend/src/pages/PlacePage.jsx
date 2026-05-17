import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPlaceById } from "../api/placesApi.js";
import BookingWidget from "../components/booking/BookingWidget.jsx";
import PlaceGallery from "../components/place/PlaceGallery.jsx";
import ReviewSection from "../components/place/ReviewSection.jsx";
import LocationMap from "../components/place/LocationMap.jsx";
import { motion } from "framer-motion";
import { MapPin, Share, Heart, CheckCircle2 } from "lucide-react";
import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext.jsx";
import { RecentlyViewedContext } from "../context/RecentlyViewedContext.jsx";
import { getSimilar } from "../api/recommendationsApi.js";
import RecommendationCarousel from "../components/home/RecommendationCarousel.jsx";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const { isSaved, toggleSave } = useContext(WishlistContext);
  const { addViewedPlace } = useContext(RecentlyViewedContext);
  const isLiked = place ? isSaved(place._id) : false;
  
  const [similarPlaces, setSimilarPlaces] = useState([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(true);

  useEffect(() => {
    if (!id) return;

    getPlaceById(id)
      .then((response) => {
        setPlace(response.data);
        addViewedPlace(response.data._id);
      })
      .catch((err) => {
        console.log("Error fetching place:", err);
      });

    setIsLoadingSimilar(true);
    getSimilar(id).then(res => {
      setSimilarPlaces(res.data);
    }).catch(err => console.error(err))
      .finally(() => setIsLoadingSimilar(false));
  }, [id]);

  if (!place) {
    return (
      <div className="max-w-6xl mx-auto px-6 pt-12 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-[400px] bg-gray-200 rounded-2xl mb-8"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white dark:bg-transparent min-h-screen px-4 md:px-12 lg:px-20 pt-8 pb-16 max-w-[80rem] mx-auto transition-colors duration-500"
    >
      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-3">
          {place.title}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200 font-medium hover:underline cursor-pointer transition text-sm sm:text-base">
            <MapPin className="w-4 h-4" />
            <a 
              target="_blank" 
              rel="noreferrer" 
              href={'https://maps.google.com/?q='+place.address}
            >
              {place.address}
            </a>
          </div>
          
          <div className="flex items-center gap-4 text-gray-800 dark:text-gray-200 font-medium text-sm">
            <button 
              onClick={() => toggleSave(place)}
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
              aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
            >
              <motion.div
                whileTap={{ scale: 0.8 }}
                animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'fill-brand stroke-brand' : ''}`} />
              </motion.div>
              <span className="underline">{isLiked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Images Gallery */}
      <div className="mb-12">
        <PlaceGallery place={place} />
      </div>

      {/* Main Content Split */}
      <div className="grid gap-12 grid-cols-1 lg:grid-cols-[2fr_1fr]">
        
        {/* Left Section (Content) */}
        <div className="pr-0 lg:pr-8">
          {/* Subheader */}
          <div className="flex justify-between items-center mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Hosted by HotelBazaar Host
              </h2>
              <p className="text-gray-700 dark:text-gray-300 font-light">
                {place.maxGuests} guests · {place.checkIn} Check-in · {place.checkOut} Check-out
              </p>
            </div>
            <div className="w-14 h-14 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-white dark:text-gray-900 shadow-sm">
              H
            </div>
          </div>

          {/* Description */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-2xl mb-4 text-gray-900 dark:text-gray-100 tracking-tight">About this place</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light whitespace-pre-line text-[15px]">
              {place.description}
            </p>
          </div>

          {/* Perks/Amenities mapping */}
          {place.perks && place.perks.length > 0 && (
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
              <h2 className="font-semibold text-2xl mb-6 text-gray-900 dark:text-gray-100 tracking-tight">What this place offers</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                {place.perks.map(perk => (
                  <div key={perk} className="flex items-center gap-3 text-gray-800 dark:text-gray-300 font-light">
                    <CheckCircle2 className="w-6 h-6 text-gray-600 dark:text-gray-400 stroke-1" />
                    <span className="capitalize">{perk.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extra Info */}
          <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-2xl mb-4 text-gray-900 dark:text-gray-100 tracking-tight">Things to know</h2>
            <p className="text-[15px] text-gray-700 dark:text-gray-300 font-light leading-relaxed whitespace-pre-line">
              {place.extraInfo}
            </p>
          </div>
        </div>

        {/* Right Section (Booking Widget) */}
        <div className="relative">
          <div className="sticky top-24 pb-12">
            <BookingWidget place={place} />
          </div>
        </div>
      </div>

      <hr className="my-10 border-gray-200 dark:border-gray-800" />

      {/* Location Map */}
      <LocationMap address={place.address} />

      {/* Reviews */}
      <ReviewSection placeId={place._id} />

      <hr className="my-10 border-gray-200 dark:border-gray-800" />

      {/* Similar Accommodations */}
      <div className="-mx-4 md:-mx-12 lg:-mx-20 px-4 md:px-12 lg:px-20 overflow-hidden">
        <RecommendationCarousel 
          title="Similar Accommodations" 
          reason="Similar Price Range"
          places={similarPlaces} 
          isLoading={isLoadingSimilar} 
        />
      </div>

    </motion.div>
  );
}