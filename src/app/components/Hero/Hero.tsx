"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedText = ({ children }: { children: React.ReactNode }) => (
  <motion.span
    className="relative inline-block mt-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
    whileHover={{ scale: 1.05 }}
  >
    {children}
    <motion.div
      className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-cyan-400"
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ type: "spring", stiffness: 300 }}
    />
  </motion.span>
);

function Hero() {
  const [particles, setParticles] = useState<
    { x: string; y: string; duration: number }[]
  >([]);

  useEffect(() => {
    const generateParticles = [...Array(20)].map(() => ({
      x: `${Math.random() * 100 - 50}%`,
      y: `${Math.random() * 100 - 50}%`,
      duration: 2 + Math.random() * 4,
    }));
    setParticles(generateParticles);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      <motion.div
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative px-6 text-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
          <AnimatedText>Build Your Next Project</AnimatedText>
          <br />
          <AnimatedText>In Minutes</AnimatedText>
        </h1>

        <div className="mt-12 flex justify-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-2xl shadow-indigo-500/30 hover:shadow-purple-500/40 transition-all duration-300 group overflow-hidden">
              <span className="relative z-10">Build Now →</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </motion.div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {particles.map(({ x, y, duration }, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/50 rounded-full"
              initial={{ opacity: 0, scale: 0, x, y }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], x, y }}
              transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Hero;
