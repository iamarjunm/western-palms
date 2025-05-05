// components/CuratedEdit.jsx
"use client";

import { motion, useAnimation } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    id: 1,
    title: "The Sculptural Silhouettes",
    description: "Architectural pieces that redefine your form",
    image: "https://picsum.photos/600/800?random",
    color: "#e4dfd7",
    items: 8,
  },
  {
    id: 2,
    title: "Desert Nocturnes",
    description: "Evening wear with primal elegance",
    image: "https://picsum.photos/600/800?random",
    color: "#dcd6cf",
    items: 12,
  },
  {
    id: 3,
    title: "Liquid Linen",
    description: "Weightless layers for infinite movement",
    image: "https://picsum.photos/600/800?random",
    color: "#c8beb3",
    items: 5,
  },
];

export default function CuratedEdit() {
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();
  const containerRef = useRef(null);

  // Auto-rotate collections
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === collections.length - 1 ? 0 : prev + 1));
    controls.start({ opacity: 0, x: 20, transition: { duration: 0.3 } })
      .then(() => {
        controls.start({ opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } });
      });
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? collections.length - 1 : prev - 1));
    controls.start({ opacity: 0, x: -20, transition: { duration: 0.3 } })
      .then(() => {
        controls.start({ opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } });
      });
  };

  return (
    <section className="relative py-24 bg-[#f7f3ee] overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10">
        <Image 
          src="/images/texture.png" 
          alt="" 
          fill 
          className="object-cover mix-blend-overlay" 
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#1e3d2f] mb-4">
            <span className="block">The Curated</span>
            <span className="italic font-medium text-[#2d5c46]">Edits</span>
          </h2>
          <p className="text-[#3e554a] max-w-2xl mx-auto">
            Expertly composed collections for every facet of your extraordinary life
          </p>
        </motion.div>

        {/* Collection showcase */}
        <div className="relative h-[80vh] min-h-[600px] max-h-[800px]">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === activeIndex ? 1 : 0,
                zIndex: index === activeIndex ? 10 : 1
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              {/* Collection image */}
              <motion.div
                animate={controls}
                className="relative h-full rounded-3xl overflow-hidden shadow-2xl"
                style={{ backgroundColor: collection.color }}
              >
                <Image
                  src={collection.image}
                  alt={collection.title}
                  fill
                  className="object-cover"
                  priority={index === activeIndex}
                />
                <div className="absolute bottom-6 left-6 bg-[#f7f3ee] text-[#1e3d2f] px-4 py-2 rounded-full text-xs tracking-widest shadow">
                  {collection.items} PIECES
                </div>
              </motion.div>

              {/* Collection info */}
              <motion.div 
                animate={controls}
                className="flex flex-col justify-center"
              >
                <div className="mb-8">
                  <span className="text-sm text-[#3e554a] tracking-widest">
                    0{index + 1} — 0{collections.length}
                  </span>
                  <h3 className="text-4xl md:text-5xl font-light text-[#1e3d2f] mt-2 mb-4">
                    {collection.title}
                  </h3>
                  <p className="text-lg text-[#3e554a] max-w-md">
                    {collection.description}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link
                    href={`/collections/${collection.id}`}
                    className="px-8 py-3 bg-[#1e3d2f] text-[#f7f3ee] text-sm font-medium tracking-wider uppercase rounded-full hover:bg-[#2d5c46] transition-colors duration-300"
                  >
                    Explore Collection
                  </Link>
                  <button 
                    onClick={() => window.open(collection.image, '_blank')}
                    className="px-8 py-3 border border-[#1e3d2f] text-[#1e3d2f] text-sm font-medium tracking-wider uppercase rounded-full hover:bg-[#1e3d2f]/5 transition-colors duration-300"
                  >
                    Lookbook
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ))}

          {/* Navigation arrows */}
          <div className="absolute bottom-6 right-6 z-20 flex gap-4">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 flex items-center justify-center bg-[#f7f3ee] text-[#1e3d2f] rounded-full shadow-md hover:bg-[#1e3d2f] hover:text-[#f7f3ee] transition-all duration-300"
              aria-label="Previous collection"
            >
              ←
            </button>
            <button 
              onClick={handleNext}
              className="w-12 h-12 flex items-center justify-center bg-[#f7f3ee] text-[#1e3d2f] rounded-full shadow-md hover:bg-[#1e3d2f] hover:text-[#f7f3ee] transition-all duration-300"
              aria-label="Next collection"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}