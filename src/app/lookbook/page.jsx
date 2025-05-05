"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const categories = [
  { id: "top", name: "Tops", cover: "https://picsum.photos/600/800?random" },
  { id: "shirt", name: "Shirts", cover: "https://picsum.photos/600/800?random" },
  { id: "coords", name: "Co-ords", cover: "https://picsum.photos/600/800?random" },
  { id: "jeans", name: "Jeans", cover: "https://picsum.photos/600/800?random" },
  { id: "pants", name: "Pants", cover: "https://picsum.photos/600/800?random" },
  { id: "shorts", name: "Shorts", cover: "https://picsum.photos/600/800?random" },
  { id: "skirts", name: "Skirts", cover: "https://picsum.photos/600/800?random" }
];

const looks = {
  top: [
    { id: 1, image: "https://picsum.photos/600/800?random", title: "The Relaxed Tee", tags: ["casual", "oversized"] },
    { id: 2, image: "https://picsum.photos/600/800?random", title: "Cropped Blouse", tags: ["office", "tailored"] },
    { id: 3, image: "https://picsum.photos/600/800?random", title: "Sleeveless Bodysuit", tags: ["going out", "form-fitting"] }
  ],
  shirt: [
    { id: 1, image: "https://picsum.photos/600/800?random", title: "Classic Oxford", tags: ["workwear", "timeless"] },
    { id: 2, image: "https://picsum.photos/600/800?random", title: "Silk Button-Up", tags: ["luxe", "evening"] },
    { id: 3, image: "https://picsum.photos/600/800?random", title: "Oversized Denim", tags: ["streetwear", "boyfriend"] }
  ],
  coords: [
    { id: 1, image: "https://picsum.photos/600/800?random", title: "Linen Set", tags: ["summer", "minimal"] },
    { id: 2, image: "/lookbook/coords-2.jpg", title: "Silk Two-Piece", tags: ["luxury", "evening"] },
    { id: 3, image: "/lookbook/coords-3.jpg", title: "Knit Combo", tags: ["winter", "cozy"] }
  ],
  jeans: [
    { id: 1, image: "https://picsum.photos/600/800?random", title: "90s Straight", tags: ["vintage", "classic"] },
    { id: 2, image: "/lookbook/jeans-2.jpg", title: "High-Waisted", tags: ["slim", "elevated"] },
    { id: 3, image: "/lookbook/jeans-3.jpg", title: "Destroyed Boyfriend", tags: ["edgy", "relaxed"] }
  ],
  pants: [
    { id: 1, image: "https://picsum.photos/600/800?random", title: "Wide-Leg Trousers", tags: ["office", "tailored"] },
    { id: 2, image: "/lookbook/pants-2.jpg", title: "Cargo Pants", tags: ["streetwear", "utility"] },
    { id: 3, image: "/lookbook/pants-3.jpg", title: "Silk Slacks", tags: ["evening", "luxe"] }
  ],
  shorts: [
    { id: 1, image: "https://picsum.photos/600/800?random", title: "Denim Cutoffs", tags: ["summer", "casual"] },
    { id: 2, image: "/lookbook/shorts-2.jpg", title: "Tailored Bermuda", tags: ["smart", "preppy"] },
    { id: 3, image: "/lookbook/shorts-3.jpg", title: "Athletic Shorts", tags: ["active", "comfy"] }
  ],
  skirts: [
    { id: 1, image: "/lookbook/skirts-1.jpg", title: "Mini Skirt", tags: ["going out", "sexy"] },
    { id: 2, image: "/lookbook/skirts-2.jpg", title: "Midi Pleated", tags: ["office", "elegant"] },
    { id: 3, image: "/lookbook/skirts-3.jpg", title: "Maxi Wrap", tags: ["boho", "flowy"] }
  ]
};

export default function Lookbook() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeLook, setActiveLook] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or carousel

  // Reset selections when category changes
  useEffect(() => {
    setActiveLook(null);
  }, [activeCategory]);

  return (
    <section className="relative py-32 bg-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 -translate-y-full bg-gradient-to-b from-transparent to-white z-10" />
      
      {/* Section header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "0px 0px -50px 0px", once: true }}
          className="text-6xl font-medium text-[#1e3d2f] mb-6"
        >
          The Style Archives
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ margin: "0px 0px -50px 0px", once: true }}
          className="text-xl text-[#3e554a] max-w-3xl mx-auto"
        >
          Mix, match and discover endless outfit possibilities across our collections
        </motion.p>
      </div>

      {/* Category selector */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium tracking-wider transition-all ${
                activeCategory === category.id
                  ? "bg-[#1e3d2f] text-white"
                  : "bg-[#f7f3ee] text-[#1e3d2f] hover:bg-[#e8e0d5]"
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!activeCategory ? (
          // Category grid view
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                whileHover="hover"
                onClick={() => setActiveCategory(category.id)}
                className="relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer group"
              >
                <Image
                  src={category.cover}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <motion.div
                  variants={{
                    hover: { opacity: 0.7 }
                  }}
                  className="absolute inset-0 bg-black/50"
                />
                <motion.div
                  variants={{
                    hover: { y: -10 }
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute bottom-0 left-0 p-6 w-full"
                >
                  <h3 className="text-2xl font-medium text-white">
                    {category.name}
                  </h3>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    variants={{
                      hover: { opacity: 1, y: 0 }
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-white/90 mt-2">Explore Looks →</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Category detail view
          <div className="space-y-12">
            {/* View mode toggle */}
            <div className="flex justify-end">
              <div className="inline-flex bg-[#f7f3ee] rounded-full p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    viewMode === "grid" ? "bg-white text-[#1e3d2f] shadow-sm" : "text-[#3e554a]"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("carousel")}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    viewMode === "carousel" ? "bg-white text-[#1e3d2f] shadow-sm" : "text-[#3e554a]"
                  }`}
                >
                  Carousel
                </button>
              </div>
            </div>

            {/* Looks display */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {looks[activeCategory].map((look) => (
                  <LookCard 
                    key={look.id} 
                    look={look} 
                    onClick={() => setActiveLook(look)} 
                  />
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {looks[activeCategory].map((look) => (
                    <LookCard 
                      key={look.id} 
                      look={look} 
                      onClick={() => setActiveLook(look)} 
                      carousel
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Look modal */}
      <AnimatePresence>
        {activeLook && (
          <LookModal 
            look={activeLook} 
            onClose={() => setActiveLook(null)} 
            category={categories.find(c => c.id === activeCategory)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function LookCard({ look, onClick, carousel = false }) {
  return (
    <motion.div
      whileHover={carousel ? { scale: 1.03 } : { y: -5 }}
      onClick={onClick}
      className={`${carousel ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"} group`}
    >
      <div className={`relative ${carousel ? "aspect-[4/5]" : "aspect-[3/4]"} rounded-2xl overflow-hidden mb-4`}>
        <Image
          src={look.image}
          alt={look.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={carousel ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 50vw"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-[#1e3d2f]">{look.title}</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {look.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-[#f7f3ee] text-xs text-[#3e554a] rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function LookModal({ look, category, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full hover:bg-[#f7f3ee] transition-all"
        >
          <CloseIcon className="w-6 h-6 text-[#3e554a]" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative aspect-[3/4]">
            <Image
              src={look.image}
              alt={look.title}
              fill
              className="object-cover rounded-l-3xl"
            />
          </div>

          {/* Details */}
          <div className="p-12">
            <div className="mb-8">
              <span className="text-sm uppercase tracking-wider text-[#3e554a]">
                {category.name}
              </span>
              <h2 className="text-4xl font-medium text-[#1e3d2f] mt-2 mb-4">
                {look.title}
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {look.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1.5 bg-[#f7f3ee] text-sm text-[#3e554a] rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-[#3e554a]">
                This {look.title.toLowerCase()} from our {category.name.toLowerCase()} collection is designed for all-day comfort without compromising on style. The premium fabric drapes beautifully while maintaining structure.
              </p>
            </div>

            {/* Styling tips */}
            <div className="mb-10">
              <h3 className="text-sm uppercase tracking-wider text-[#3e554a] mb-4">
                Styling Suggestions
              </h3>
              <div className="space-y-4">
                {[
                  `Pair with ${category.id === "skirts" ? "a cropped top" : "high-waisted bottoms"} for balanced proportions`,
                  "Layer with textured accessories for dimension",
                  "Dress up with heels or down with sneakers"
                ].map((tip, i) => (
                  <div key={i} className="flex items-start">
                    <CheckIcon className="w-5 h-5 mr-3 text-[#2d5c46] flex-shrink-0 mt-0.5" />
                    <p className="text-[#3e554a]">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/shop/${category.id}?look=${look.id}`}
                className="flex-1 px-6 py-3 bg-[#1e3d2f] text-white rounded-full text-center font-medium hover:bg-[#2d5c46] transition-all"
              >
                Shop This Look
              </Link>
              <button className="flex-1 px-6 py-3 border border-[#1e3d2f] text-[#1e3d2f] rounded-full font-medium hover:bg-[#f7f3ee] transition-all">
                Save to Wishlist
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Custom Icons
function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  );
}