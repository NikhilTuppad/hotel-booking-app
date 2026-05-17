import { useRef } from "react";
import HotelCard from "./HotelCard";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RecommendationCarousel({ title, subtitle, reason, places, isLoading }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 px-4 md:px-8">{title}</h2>
        <div className="flex gap-6 overflow-x-hidden px-4 md:px-8 pb-8 pt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] bg-gray-200 rounded-[2rem] aspect-[1/1.05] animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!places || places.length === 0) return null;

  return (
    <div className="mb-16 relative group">
      <div className="px-4 md:px-8 mb-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{title}</h2>
            {reason && (
              <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest">
                {reason}
              </span>
            )}
          </div>
          {subtitle && <p className="text-gray-500 font-light">{subtitle}</p>}
        </div>
        
        {/* Navigation Buttons */}
        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-4 md:px-8 pb-12 pt-4 -mx-4 md:-mx-8 lg:mx-0 lg:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Added extra padding elements to keep margin visual trick intact on mobile */}
        <div className="w-1 md:w-4 shrink-0 lg:hidden"></div>
        {places.map((place, index) => (
          <motion.div 
            key={place._id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] snap-start h-full"
          >
            <HotelCard place={place} />
          </motion.div>
        ))}
        <div className="w-1 md:w-4 shrink-0 lg:hidden"></div>
      </div>
    </div>
  );
}
