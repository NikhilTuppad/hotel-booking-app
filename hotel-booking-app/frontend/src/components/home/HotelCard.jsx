import { Link } from "react-router-dom";
import Image from "../ui/Image.jsx";
import { motion } from "framer-motion";
import { Star, Heart, Users, Wallet } from "lucide-react";
import { useContext } from "react";
import { WishlistContext } from "../../context/WishlistContext.jsx";
import TiltCard from "../ui/TiltCard.jsx";

export default function HotelCard({ place }) {
  const { isSaved, toggleSave } = useContext(WishlistContext);
  const isLiked = isSaved(place._id);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full"
    >
      <TiltCard className="group relative cursor-pointer h-full">
        <Link to={'/place/'+place._id} className="flex flex-col w-full h-full p-3 glass-deep rounded-[2rem] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand/10 transition-all duration-300 bg-white/40 dark:bg-gray-900/40 border border-transparent hover:border-brand/20">
          {/* Image Container */}
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden aspect-[4/3] mb-4 shadow-inner shrink-0">
            {place.photos?.[0] ? (
              <Image
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                src={place.photos?.[0]}
                alt={place.title}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            )}
            
            {/* Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/95 dark:bg-black/90 backdrop-blur-md text-gray-900 dark:text-white rounded-full shadow-sm">
                {place.price < 2500 ? "Best Value" : place.price > 6000 ? "Popular" : "Family Friendly"}
              </span>
            </div>
            
            {/* Wishlist Button */}
            <button 
              aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
              onClick={(e) => {
                e.preventDefault();
                toggleSave(place);
              }}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/10 transition-colors z-10"
            >
              <motion.div
                whileTap={{ scale: 0.8 }}
                animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  className={`w-6 h-6 transition-colors ${isLiked ? 'fill-brand stroke-brand drop-shadow-md' : 'fill-black/40 stroke-white'}`} 
                />
              </motion.div>
            </button>
          </div>

          {/* Info */}
          <div className="px-1 pb-1 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-1.5">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1 text-[16px] pr-2" title={place.address}>{place.address}</h2>
              <div className="flex items-center gap-1 text-[13px] font-bold text-gray-800 dark:text-gray-200 bg-white/60 dark:bg-black/40 px-1.5 py-0.5 rounded-md backdrop-blur-sm shrink-0">
                <Star className="w-3.5 h-3.5 fill-brand stroke-brand" />
                <span>4.9</span>
              </div>
            </div>
            
            <h3 className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-3 font-light" title={place.title}>{place.title}</h3>
            
            <div className="mt-auto pt-3 border-t border-gray-200/60 dark:border-gray-700/60 flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-brand" />
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-brand dark:text-brand-light text-[17px]">₹{place.price}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">/ night</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-xs font-semibold bg-gray-100/80 dark:bg-gray-800/80 px-2.5 py-1.5 rounded-lg w-fit">
                <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span>Max {place.maxGuests || 4} Guests</span>
              </div>
            </div>
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
}
