import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext.jsx";
import { getWishlist, toggleWishlist as apiToggleWishlist } from "../api/wishlistApi.js";
import { showSuccess, showError } from "../utils/toast.js";

export const WishlistContext = createContext({});

export function WishlistContextProvider({ children }) {
  const { user } = useContext(UserContext);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistPlaces, setWishlistPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingMap, setTogglingMap] = useState({});

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistIds([]);
      setWishlistPlaces([]);
      setLoading(false);
    }
  }, [user]);

  async function fetchWishlist() {
    try {
      setLoading(true);
      const { data } = await getWishlist();
      setWishlistPlaces(data.filter(item => item.place != null));
      setWishlistIds(data.map(item => item.place?._id).filter(Boolean));
    } catch (err) {
      console.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  }

  async function toggleSave(place) {
    if (!user) {
      showError("Please log in to save to your wishlist.");
      return;
    }

    const placeId = place._id;

    if (togglingMap[placeId]) return;

    setTogglingMap(prev => ({ ...prev, [placeId]: true }));

    const isCurrentlySaved = wishlistIds.includes(placeId);

    // Optimistic UI update
    setWishlistIds(prev => 
      isCurrentlySaved ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );

    try {
      const { data } = await apiToggleWishlist(placeId);
      
      if (data.action === 'added') {
        showSuccess("Saved to Wishlist! ❤️", `wishlist-${placeId}`);
        fetchWishlist(); // Silently update populated places
      } else {
        showSuccess("Removed from Wishlist", `wishlist-${placeId}`);
        setWishlistPlaces(prev => prev.filter(item => item.place?._id !== placeId));
      }
    } catch (err) {
      // Revert optimistic update on failure
      setWishlistIds(prev => 
        isCurrentlySaved ? [...prev, placeId] : prev.filter(id => id !== placeId)
      );
      showError("Failed to update wishlist", `wishlist-err-${placeId}`);
    } finally {
      setTogglingMap(prev => ({ ...prev, [placeId]: false }));
    }
  }

  const isSaved = (placeId) => wishlistIds.includes(placeId);

  return (
    <WishlistContext.Provider value={{ wishlistIds, wishlistPlaces, loading, toggleSave, isSaved }}>
      {children}
    </WishlistContext.Provider>
  );
}
