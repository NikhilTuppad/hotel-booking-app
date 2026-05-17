import { createContext, useState, useEffect } from "react";

export const RecentlyViewedContext = createContext({});

export function RecentlyViewedContextProvider({ children }) {
  const [viewedIds, setViewedIds] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      if (stored) {
        setViewedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load recently viewed", e);
    }
  }, []);

  const addViewedPlace = (id) => {
    setViewedIds((prev) => {
      const filtered = prev.filter(item => item !== id);
      const updated = [id, ...filtered].slice(0, 15); 
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ viewedIds, addViewedPlace }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}
