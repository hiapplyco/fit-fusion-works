import { motion } from "framer-motion";

export const HeaderSection = () => {
  return (
    <header className="w-full py-12 relative bg-black/80 backdrop-blur-sm">
      <motion.h1 
        className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-oswald font-bold text-destructive dark:text-white transform -skew-x-12 uppercase tracking-wider text-center border-[6px] border-black rounded-lg px-4 py-3 shadow-[inset_0px_0px_0px_2px_rgba(255,255,255,1),8px_8px_0px_0px_rgba(255,0,0,1),12px_12px_0px_0px_#C4A052] max-w-3xl mx-auto backdrop-blur-sm relative z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        strength.design
      </motion.h1>
    </header>
  );
};