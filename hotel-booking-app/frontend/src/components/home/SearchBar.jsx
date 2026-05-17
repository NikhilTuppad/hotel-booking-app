import { Search, Users, DollarSign, Filter } from "lucide-react";

export default function SearchBar({
  searchCity, setSearchCity,
  searchGuests, setSearchGuests,
  maxPrice, setMaxPrice,
  sortBy, setSortBy
}) {
  return (
    <div className="relative z-10 -mt-20 mb-16 px-4 max-w-5xl mx-auto">
      <div className="glass-panel rounded-[2rem] md:rounded-full p-2 md:p-3 shadow-float flex flex-col md:flex-row items-center gap-2 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200/50">
        
        {/* City Input */}
        <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full">
          <Search className="w-5 h-5 text-gray-400 hidden md:block" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] uppercase font-bold text-gray-800 tracking-wider">Where</label>
            <input 
              type="text" 
              placeholder="Search destinations" 
              className="bg-transparent border-none p-0 my-0 focus:ring-0 text-sm md:text-base outline-none w-full placeholder-gray-400 font-medium"
              value={searchCity}
              onChange={e => setSearchCity(e.target.value)}
            />
          </div>
        </div>

        {/* Guests Input */}
        <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full">
          <Users className="w-5 h-5 text-gray-400 hidden md:block" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] uppercase font-bold text-gray-800 tracking-wider">Who</label>
            <input 
              type="number" 
              placeholder="Add guests" 
              className="bg-transparent border-none p-0 my-0 focus:ring-0 text-sm md:text-base outline-none w-full placeholder-gray-400 font-medium"
              value={searchGuests}
              onChange={e => setSearchGuests(e.target.value)}
            />
          </div>
        </div>

        {/* Max Price Input */}
        <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full">
          <DollarSign className="w-5 h-5 text-gray-400 hidden md:block" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] uppercase font-bold text-gray-800 tracking-wider">Budget</label>
            <input 
              type="number" 
              placeholder="Max price" 
              className="bg-transparent border-none p-0 my-0 focus:ring-0 text-sm md:text-base outline-none w-full placeholder-gray-400 font-medium"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex-1 flex items-center gap-3 px-6 py-3 w-full">
          <Filter className="w-5 h-5 text-gray-400 hidden md:block" />
          <div className="flex flex-col w-full">
            <label className="text-[10px] uppercase font-bold text-gray-800 tracking-wider">Sort</label>
            <select 
              className="bg-transparent border-none p-0 my-0 focus:ring-0 text-sm md:text-base outline-none w-full text-gray-700 font-medium appearance-none cursor-pointer"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="">Recommended</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="px-2 w-full md:w-auto py-2 md:py-0">
          <button className="bg-brand hover:bg-primaryDark w-full md:w-auto px-8 py-4 rounded-full text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
            <Search className="w-5 h-5" />
            <span className="md:hidden">Search</span>
          </button>
        </div>

      </div>
    </div>
  );
}
