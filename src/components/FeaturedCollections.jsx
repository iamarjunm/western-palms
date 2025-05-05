"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const curatedCollections = [
  {
    id: 1,
    title: "Desert Bloom",
    description: "Floral patterns meet southwestern vibes",
    href: "/collections/desert-bloom",
    image: "https://picsum.photos/600/800?random",
    color: "from-[#FF9E9E] to-[#FFD1DC]",
    textColor: "text-[#8B3E3E]",
    buttonColor: "bg-[#FF6B6B] hover:bg-[#E05555]",
    featured: true
  },
  {
    id: 2,
    title: "Canyon Nights",
    description: "Evening wear with a desert twist",
    href: "/collections/canyon-nights",
    image: "https://picsum.photos/600/800?random=2",
    color: "from-[#8338EC] to-[#3A86FF]",
    textColor: "text-[#2D1E3F]",
    buttonColor: "bg-[#8338EC] hover:bg-[#6A2DC2]",
    featured: true
  },
  {
    id: 3,
    title: "Palm Springs Cool",
    description: "Retro-inspired summer essentials",
    href: "/collections/palm-springs",
    image: "https://picsum.photos/600/800?random=3",
    color: "from-[#FFBE0B] to-[#FF9E00]",
    textColor: "text-[#5C4200]",
    buttonColor: "bg-[#FFBE0B] hover:bg-[#E5A800]",
    featured: true
  },
  {
    id: 4,
    title: "Saguaro Silhouettes",
    description: "Structured pieces with organic shapes",
    href: "/collections/saguaro",
    image: "https://picsum.photos/600/800?random=4",
    color: "from-[#4ECDC4] to-[#A2D729]",
    textColor: "text-[#1E3D2F]",
    buttonColor: "bg-[#4ECDC4] hover:bg-[#3AB9B0]"
  },
  {
    id: 5,
    title: "Adobe Dreams",
    description: "Earthy tones for everyday elegance",
    href: "/collections/adobe",
    image: "https://picsum.photos/600/800?random=5",
    color: "from-[#FF8A5B] to-[#FF6B6B]",
    textColor: "text-[#5C2A1A]",
    buttonColor: "bg-[#FF8A5B] hover:bg-[#E5734F]"
  },
  {
    id: 6,
    title: "Mojave Minimal",
    description: "Clean lines, desert-inspired neutrals",
    href: "/collections/mojave",
    image: "https://picsum.photos/600/800?random=7",
    color: "from-[#E2C6D6] to-[#F8E1C8]",
    textColor: "text-[#3E554A]",
    buttonColor: "bg-[#D4B8C7] hover:bg-[#C2A6B5]"
  }
];

export default function featuredCollections() {
  const [activeCollection, setActiveCollection] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isHovering && !isMobile) {
      const interval = setInterval(() => {
        setActiveCollection((prev) => 
          prev === curatedCollections.filter(c => c.featured).length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovering, isMobile]);

  const featuredCollections = curatedCollections.filter(c => c.featured);
  const otherCollections = curatedCollections.filter(c => !c.featured);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FFE8D6] to-[#F8E1C8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-[#1e3d2f]"
          >
            Curated Selections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-[#3e554a] max-w-3xl mx-auto"
          >
            Handpicked collections that embody the free spirit of the West
          </motion.p>
        </div>
        {/* Other Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherCollections.map((collection) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className={`bg-gradient-to-br ${collection.color} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all group`}
            >
              <Link href={collection.href} className="block h-full">
                <div className="h-48 relative">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-2 ${collection.textColor}`}>
                    {collection.title}
                  </h3>
                  <p className={`mb-4 ${collection.textColor}`}>
                    {collection.description}
                  </p>
                  <span className={`inline-block px-4 py-2 text-sm rounded-full ${collection.buttonColor} text-white font-medium`}>
                    Explore
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF6B6B]/20 rounded-full filter blur-3xl -z-0"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#3A86FF]/20 rounded-full filter blur-3xl -z-0"></div>
    </section>
  );
}