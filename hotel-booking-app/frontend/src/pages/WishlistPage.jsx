import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext.jsx";
import AccountNav from "../components/layout/AccountNav.jsx";
import HotelCard from "../components/home/HotelCard.jsx";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { wishlistPlaces, loading } = useContext(WishlistContext);

  return (
    <div className="flex flex-col min-h-screen">
      <AccountNav />

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full mt-8 mb-20">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-brand fill-brand drop-shadow-sm" />
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight drop-shadow-sm">Your Wishlist</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 rounded-[2rem] aspect-[1/1.05] animate-pulse"></div>
            ))}
          </div>
        ) : wishlistPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {wishlistPlaces.map((item, index) => (
              <motion.div 
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="h-full"
              >
                <HotelCard place={item.place} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-deep rounded-[2rem] p-12 text-center shadow-premium border border-white/60 max-w-2xl mx-auto mt-12 relative overflow-hidden"
          >
            {/* Background Blob */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="bg-white/80 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-white relative z-10">
              <Heart className="w-10 h-10 text-gray-400 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 relative z-10">No saved places yet</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto font-light relative z-10">
              As you search, tap the heart icon to save your favorite places and experiences to a wishlist.
            </p>
            <Link 
              to="/" 
              className="inline-block bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-md active:scale-95 hover:shadow-lg relative z-10"
            >
              Start exploring
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
