"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function Hero() {
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  // Animated counters for stats
  const designCount = useMotionValue(0);
  const designerCount = useMotionValue(0);
  const materialCount = useMotionValue(0);
  
  const roundedDesigns = useTransform(designCount, Math.round);
  const roundedDesigners = useTransform(designerCount, Math.round);
  const roundedMaterials = useTransform(materialCount, Math.round);

  useEffect(() => {
    if (inView) {
      animate(designCount, 100, { duration: 2.5 });
      animate(designerCount, 24, { duration: 3 });
      animate(materialCount, 36, { duration: 3.5 });
    }
  }, [inView]);

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.2, 0.65, 0.3, 0.9] 
      }
    }
  };

  // Split text into letters for animation
  const title1 = "Dress";
  const title2 = "Beyond Ordinary";

  return (
    <section 
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-[#FFF5E6] via-[#FFE8D6] to-[#F8E1C8] min-h-screen flex items-center justify-center"
    >
      {/* Tropical floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => {
          const colors = ["#FF6B6B", "#4ECDC4", "#FFBE0B", "#8338EC", "#3A86FF"];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const size = Math.random() * 200 + 50;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-multiply opacity-20"
              style={{
                width: size,
                height: size,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: randomColor
              }}
              animate={{
                y: [0, Math.random() * 200 - 100],
                x: [0, Math.random() * 200 - 100],
                rotate: [0, Math.random() * 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 15 + Math.random() * 30,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      {/* Palm leaf decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <PalmLeafPattern />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center justify-between gap-12 py-24">
        {/* Left Text Content */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={textVariants}
          className="flex-1"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
            <motion.span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#8338EC] overflow-hidden">
              {title1.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  variants={letterVariants}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.span>
            <motion.span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#3A86FF] to-[#4ECDC4] overflow-hidden">
              {title2.split("").map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block"
                  variants={letterVariants}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-6 text-xl text-[#5A5A5A] max-w-md leading-relaxed font-medium"
          >
            Bold silhouettes, vibrant colors, and feminine energy — discover statement pieces at Western Palms.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex flex-col sm:flex-row gap-6 items-start"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B6B] to-[#FFBE0B] rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500" />
              <Link
                href="/shop"
                className="relative px-10 py-4 bg-gradient-to-r from-[#FF6B6B] to-[#FFBE0B] text-white text-sm font-bold uppercase tracking-widest rounded-full hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                Shop Collection
              </Link>
            </motion.div>

            <Link
              href="/about"
              className="text-sm font-bold uppercase tracking-widest text-[#5A5A5A] hover:text-[#3A86FF] transition-all duration-300 flex items-center gap-2 group"
            >
              Our Story
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block group-hover:translate-x-1 transition-transform text-[#3A86FF]"
              >
                →
              </motion.span>
            </Link>
          </motion.div>

          {/* Animated stats */}
          <motion.div 
            className="mt-16 grid grid-cols-3 gap-4 text-[#5A5A5A]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/30">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#FFBE0B]">
                <motion.span>{roundedDesigns}</motion.span>+
              </p>
              <p className="text-sm mt-1 font-medium">Designs</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/30">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3A86FF] to-[#4ECDC4]">
                <motion.span>{roundedDesigners}</motion.span>
              </p>
              <p className="text-sm mt-1 font-medium">Designers</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/30">
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8338EC] to-[#FF006E]">
                <motion.span>{roundedMaterials}</motion.span>
              </p>
              <p className="text-sm mt-1 font-medium">Materials</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.1, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="flex-1 relative"
        >
          <div className="relative">
            {/* Colorful shadow effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl -z-10"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              style={{
                background: "conic-gradient(from 180deg at 50% 50%, #FF6B6B, #FFBE0B, #4ECDC4, #3A86FF, #8338EC, #FF6B6B)"
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Main image with parallax effect */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="overflow-hidden rounded-3xl shadow-2xl border-4 border-white"
            >
              <Image
                src="/images/Western.png"
                alt="Western Palms Hero"
                width={600}
                height={750}
                className="object-cover w-full h-full"
                priority
              />
            </motion.div>
            
            {/* Floating label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -right-4 bg-white px-6 py-2 rounded-full shadow-lg border-2 border-[#FFBE0B]"
            >
              <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#FFBE0B]">
                Summer Collection '24
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Animated scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-8 h-12 rounded-full border-2 border-[#3A86FF] flex justify-center p-1"
        >
          <motion.div
            animate={{ 
              y: [0, 8, 0],
              opacity: [1, 0.5, 1]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-2 h-2 rounded-full bg-[#3A86FF]"
          />
        </motion.div>
        <motion.p
          className="text-xs mt-2 font-medium text-[#5A5A5A] tracking-wider"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to explore
        </motion.p>
      </motion.div>
    </section>
  );
}

function PalmLeafPattern() {
  return (
    <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M150,200 C200,100 300,50 400,150 C500,250 550,350 450,450 C350,550 250,600 150,500 C50,400 100,300 150,200 Z" fill="#4ECDC4" fillOpacity="0.1"/>
      <path d="M600,300 C700,200 800,250 850,350 C900,450 850,550 750,600 C650,650 550,600 500,500 C450,400 500,400 600,300 Z" fill="#FFBE0B" fillOpacity="0.1"/>
      <path d="M800,100 C900,150 950,250 900,350 C850,450 750,500 650,450 C550,400 500,300 550,200 C600,100 700,50 800,100 Z" fill="#FF6B6B" fillOpacity="0.1"/>
    </svg>
  );
}