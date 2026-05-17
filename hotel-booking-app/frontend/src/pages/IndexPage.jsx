import {useEffect, useState} from "react";
import { getPlaces } from "../api/placesApi.js";
import { motion } from "framer-motion";

// Components
import HeroSection from "../components/home/HeroSection.jsx";
import SearchBar from "../components/home/SearchBar.jsx";
import HotelCard from "../components/home/HotelCard.jsx";
import RecommendationCarousel from "../components/home/RecommendationCarousel.jsx";
import { useContext } from "react";
import { RecentlyViewedContext } from "../context/RecentlyViewedContext.jsx";
import { getPersonalized, getByIds, getTrending } from "../api/recommendationsApi.js";

export default function IndexPage() {
  const [places,setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ SEARCH STATES
  const [searchCity, setSearchCity] = useState('');
  const [searchGuests, setSearchGuests] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');

  // ✅ RECOMMENDATION STATES
  const { viewedIds } = useContext(RecentlyViewedContext);
  const [personalizedPlaces, setPersonalizedPlaces] = useState([]);
  const [personalizedReason, setPersonalizedReason] = useState("");
  const [loadingPersonalized, setLoadingPersonalized] = useState(true);

  const [recentlyViewedPlaces, setRecentlyViewedPlaces] = useState([]);
  const [loadingRecentlyViewed, setLoadingRecentlyViewed] = useState(true);

  const [trendingPlaces, setTrendingPlaces] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  useEffect(() => {
    getPlaces().then(response => {
      setPlaces(response.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setLoadingPersonalized(true);
    getPersonalized(viewedIds).then(res => {
      setPersonalizedPlaces(res.data.places || []);
      setPersonalizedReason(res.data.reason || "Recommended");
    }).catch(err => console.error(err)).finally(() => setLoadingPersonalized(false));

    if (viewedIds && viewedIds.length > 0) {
      setLoadingRecentlyViewed(true);
      getByIds(viewedIds).then(res => {
        setRecentlyViewedPlaces(res.data);
      }).catch(err => console.error(err)).finally(() => setLoadingRecentlyViewed(false));
    } else {
      setRecentlyViewedPlaces([]);
      setLoadingRecentlyViewed(false);
    }

    setLoadingTrending(true);
    getTrending().then(res => {
      setTrendingPlaces(res.data);
    }).catch(err => console.error(err)).finally(() => setLoadingTrending(false));

  }, [viewedIds]);

  const filteredPlaces = places
    .filter(place => {
      const cityMatch = searchCity
        ? place.address.toLowerCase().includes(searchCity.toLowerCase())
        : true;

      const guestMatch = searchGuests
        ? place.maxGuests >= parseInt(searchGuests)
        : true;

      const priceMatch = maxPrice
        ? place.price <= parseInt(maxPrice)
        : true;

      return cityMatch && guestMatch && priceMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      return 0;
    });

  // Stagger animation container
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="pt-4 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      <HeroSection />

      <SearchBar 
        searchCity={searchCity} setSearchCity={setSearchCity}
        searchGuests={searchGuests} setSearchGuests={setSearchGuests}
        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        sortBy={sortBy} setSortBy={setSortBy}
      />

      {loading ? (
        <div className="grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl aspect-[1/1.05] mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* CAROUSELS (Hide if user is actively searching) */}
          {!(searchCity || searchGuests || maxPrice || sortBy) && (
            <div className="-mx-4 md:-mx-8 lg:-mx-0 px-4 md:px-8 lg:px-0">
              <RecommendationCarousel 
                title="Recommended for You" 
                reason={personalizedReason}
                places={personalizedPlaces} 
                isLoading={loadingPersonalized} 
              />
              
              <RecommendationCarousel 
                title="Trending Accommodations" 
                reason="Highly Rated"
                places={trendingPlaces} 
                isLoading={loadingTrending} 
              />

              {recentlyViewedPlaces.length > 0 && (
                <RecommendationCarousel 
                  title="Recently Viewed" 
                  reason="Your History"
                  places={recentlyViewedPlaces} 
                  isLoading={loadingRecentlyViewed} 
                />
              )}
              
              <div className="mb-6 mt-12 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">All Accommodations</h2>
              </div>
            </div>
          )}

          {filteredPlaces.length > 0 ? (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {filteredPlaces.map(place => (
                <HotelCard key={place._id} place={place} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No places found</h2>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
              <button 
                onClick={() => {
                  setSearchCity('');
                  setSearchGuests('');
                  setMaxPrice('');
                  setSortBy('');
                }}
                className="mt-6 px-6 py-3 border border-black rounded-lg font-semibold hover:bg-black hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
}