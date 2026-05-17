import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Parallax effect: slower scroll for background image
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="relative w-full h-[50vh] md:h-[60vh] rounded-[2rem] overflow-hidden mb-12 shadow-premium bg-gray-900 border border-gray-800">
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-[-20%] bg-cover bg-center will-change-transform"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c6a4d1409e1c?q=80&w=2800&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent mix-blend-multiply"></div>
      </motion.div>

      <motion.div 
        style={{ y: textY, opacity }}
        className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 pb-20 md:pb-24 will-change-transform pointer-events-none"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight max-w-2xl drop-shadow-xl"
        >
          Find your next perfect stay
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 max-w-xl font-light drop-shadow-md"
        >
          Discover premium hotels, cozy cabins, and extraordinary homes around the world.
        </motion.p>
      </motion.div>
    </div>
  );
}
