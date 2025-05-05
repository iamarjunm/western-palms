"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import {useState} from "react";

const categories = [
  {
    name: "Dresses",
    slug: "dresses",
    icon: "🌸",
    color: "from-[#FF9E9E] to-[#FFD1DC]",
  },
  {
    name: "Tops",
    slug: "tops",
    icon: "☀️",
    color: "from-[#FFBE0B] to-[#FF9E00]",
  },
  {
    name: "T-Shirts",
    slug: "t-shirts",
    icon: "👕",
    color: "from-[#4ECDC4] to-[#A2D729]",
  },
  {
    name: "Shirts",
    slug: "shirts",
    icon: "⛅",
    color: "from-[#3A86FF] to-[#4ECDC4]",
  },
  {
    name: "Tank Tops",
    slug: "tank-tops",
    icon: "🔥",
    color: "from-[#FF8A5B] to-[#FF6B6B]",
  },
  {
    name: "Co-ords",
    slug: "co-ords",
    icon: "✨",
    color: "from-[#8338EC] to-[#3A86FF]",
  },
  {
    name: "Jeans",
    slug: "jeans",
    icon: "👖",
    color: "from-[#1e3d2f] to-[#3e554a]",
  },
  {
    name: "Pants",
    slug: "pants",
    icon: "🏜️",
    color: "from-[#D4B8C7] to-[#E2C6D6]",
  },
  {
    name: "Shorts",
    slug: "shorts",
    icon: "🩳",
    color: "from-[#FFD1DC] to-[#FF9E9E]",
  },
  {
    name: "Skirts",
    slug: "skirts",
    icon: "💃",
    color: "from-[#A2D729] to-[#4ECDC4]",
  },
  {
    name: "Jeggings",
    slug: "jeggings",
    icon: "👯",
    color: "from-[#8B3E3E] to-[#FF6B6B]",
  },
  {
    name: "Cargo",
    slug: "cargo",
    icon: "🪖",
    color: "from-[#5C4200] to-[#FFBE0B]",
  }
];

export default function ShopByCategory() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFE8D6]/10 to-[#F8E1C8]/5">
      {/* Animated desert background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: -50, 
              x: Math.random() * 100,
              rotate: Math.random() * 360
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 40 - 20, 0],
              rotate: [0, Math.random() * 20 - 10, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="absolute text-3xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          >
            {["🌵", "☀️", "🏜️", "✨", "🌸"][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3d2f] mb-3">
            Categories
          </h2>
          <p className="text-lg text-[#3e554a] max-w-2xl mx-auto">
            Find your perfect Western Palms look
          </p>
        </motion.div>

        {/* Categories Grid - 3 columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(index)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link 
                href={`/shop?category=${category.slug}`}
                className="block overflow-hidden rounded-lg aspect-square shadow-md hover:shadow-xl transition-all"
              >
                {/* Gradient Background */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 transition-opacity duration-300 ${
                    hoveredCategory !== null && hoveredCategory !== index ? "opacity-50" : "opacity-90"
                  }`}
                />

                {/* Emoji Icon */}
                <motion.div
                  animate={{
                    scale: hoveredCategory === index ? [1, 1.2, 1] : 1,
                    rotate: hoveredCategory === index ? [0, 10, -10, 0] : 0
                  }}
                  transition={{ duration: 0.6 }}
                  className="absolute top-4 right-4 text-3xl"
                >
                  {category.icon}
                </motion.div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-4">
                  <motion.h3
                    animate={{
                      x: hoveredCategory === index ? [0, 5, -5, 0] : 0
                    }}
                    transition={{ duration: 0.6 }}
                    className="text-white font-bold text-lg drop-shadow-md"
                  >
                    {category.name}
                  </motion.h3>
                  
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: hoveredCategory === index ? "100%" : "0%"
                    }}
                    transition={{ duration: 0.4 }}
                    className="h-0.5 bg-white/80 my-2"
                  />

                  <motion.div
                    animate={{
                      opacity: hoveredCategory === index ? 1 : 0,
                      y: hoveredCategory === index ? 0 : 10
                    }}
                    className="flex items-center gap-1 text-white/90 text-sm"
                  >
                    Shop now <FiArrowRight className="mt-0.5" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/shop"
            className="inline-flex items-center bg-[#1e3d2f] text-white px-6 py-3 rounded-full font-medium hover:bg-[#3e554a] transition-colors shadow-md hover:shadow-lg gap-2"
          >
            Explore All Categories
            <motion.span
              animate={{
                x: [0, 4, 0],
                transition: {
                  duration: 1.5,
                  repeat: Infinity
                }
              }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}