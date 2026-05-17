import { useState } from "react";
import Image from "../ui/Image.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, X } from "lucide-react";

export default function PlaceGallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (!place || !place.photos || place.photos.length === 0) {
    return <div className="bg-gray-200 aspect-video rounded-2xl animate-pulse"></div>;
  }

  const photos = place.photos;

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden h-[400px] md:h-[500px]">
          {/* Main Image */}
          <div className="w-full h-full relative overflow-hidden bg-gray-200">
            <Image
              onClick={() => setShowAllPhotos(true)}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 hover:brightness-90 transition-all duration-500"
              src={photos[0]}
              alt={place.title}
            />
          </div>

          {/* Grid Images (only if more than 1 photo exists) */}
          {photos.length > 1 && (
            <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
              {photos.slice(1, 5).map((photo, index) => (
                <div key={index} className="w-full h-full relative overflow-hidden bg-gray-200">
                  <Image
                    onClick={() => setShowAllPhotos(true)}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 hover:brightness-90 transition-all duration-500"
                    src={photo}
                    alt={`${place.title} ${index + 2}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowAllPhotos(true)}
          className="absolute bottom-4 right-4 py-2 px-4 bg-white/90 backdrop-blur-md rounded-lg shadow-md border border-gray-200 flex items-center gap-2 hover:bg-gray-100 transition-colors font-medium text-sm"
        >
          <Grid className="w-4 h-4" />
          Show all photos
        </button>
      </div>

      <AnimatePresence>
        {showAllPhotos && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-50 overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-8 sticky top-0 bg-white/90 backdrop-blur-md py-4 z-10 border-b">
                <h2 className="text-2xl font-bold text-gray-900 line-clamp-1 mr-4">
                  Photos of {place.title}
                </h2>
                <button
                  onClick={() => setShowAllPhotos(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors shrink-0"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {photos.map((photo, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full rounded-2xl overflow-hidden bg-gray-100"
                  >
                    <Image src={photo} alt="" className="w-full h-auto object-cover" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}