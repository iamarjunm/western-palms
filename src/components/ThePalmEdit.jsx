"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

export default function ThePalmEdit() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Scroll-linked animations
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Lookbook content
  const editorials = [
    {
      id: 1,
      title: "Desert Sunrise",
      subtitle: "Morning Layers in Sand & Linen",
      image: "/images/lookbook-desert.jpg",
      cta: "Shop the Look",
      url: "/looks/desert",
      color: "#e8d9c5",
      position: "left"
    },
    {
      id: 2,
      title: "Coastal Evenings",
      subtitle: "Breezy Silhouettes for Golden Hour",
      image: "/images/lookbook-coastal.jpg",
      cta: "Explore Pieces",
      url: "/looks/coastal",
      color: "#d9e3e8",
      position: "right"
    }
  ];

  return (
    <section 
      ref={containerRef}
      className="relative py-32 bg-[#f7f3ee] overflow-hidden"
    >
      {/* Section title with scroll fade */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center"
      >
        <h2 className="text-5xl font-medium text-[#1e3d2f] mb-4">
          The Palm Edit
        </h2>
        <p className="text-lg text-[#3e554a] max-w-3xl mx-auto">
          Styling narratives for the modern wanderer—where each piece tells a story.
        </p>
      </motion.div>

      {/* Editorial blocks */}
      <div className="space-y-32">
        {editorials.map((editorial) => (
          <EditorialBlock key={editorial.id} editorial={editorial} y1={y1} />
        ))}
      </div>

      {/* View all CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ margin: "0px 0px -100px 0px" }}
        transition={{ delay: 0.4 }}
        className="text-center mt-32"
      >
        <Link
          href="/lookbook"
          className="inline-flex items-center px-8 py-3 border border-[#1e3d2f] rounded-full text-[#1e3d2f] hover:bg-[#1e3d2f] hover:text-white transition-all duration-500 group"
        >
          <span className="font-medium tracking-wider">View Full Lookbook</span>
          <span className="ml-3 inline-block group-hover:translate-x-2 transition-transform">
            <ArrowIcon />
          </span>
        </Link>
      </motion.div>

      {/* Decorative palm motif (animated) */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute bottom-0 right-0 opacity-5 -z-0"
      >
        <PalmClusterIcon className="w-96 h-96 text-[#1e3d2f]" />
      </motion.div>
    </section>
  );
}

// Individual Editorial Block
function EditorialBlock({ editorial, y1 }) {
  return (
    <motion.div 
      className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${editorial.position === "right" ? "md:flex-row-reverse" : "md:flex-row"} gap-12 items-center`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ margin: "0px 0px -100px 0px", once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Image with parallax effect */}
      <motion.div 
        style={{ y: y1 }}
        className="w-full md:w-1/2 relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
      >
        <Image
          src={editorial.image}
          alt={editorial.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
      </motion.div>

      {/* Text content */}
      <div className="w-full md:w-1/2 relative z-10">
        <motion.div
          className="p-8 md:p-12 bg-white rounded-2xl shadow-lg"
          initial={{ x: editorial.position === "right" ? 50 : -50 }}
          whileInView={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h3 className="text-3xl font-medium text-[#1e3d2f] mb-2">
            {editorial.title}
          </h3>
          <p className="text-lg text-[#3e554a] mb-6">
            {editorial.subtitle}
          </p>
          
          {/* Styling tips (appear on hover) */}
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            whileHover={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-[#e4dfd7]">
              <p className="text-sm uppercase tracking-wider text-[#3e554a] mb-2">
                Styling Tip
              </p>
              <p className="text-[#3e554a]">
                Layer with textured accessories and neutral tones for effortless depth.
              </p>
            </div>
          </motion.div>

          {/* CTA with magnetic effect */}
          <motion.div
            whileHover={{ 
              scale: 1.02,
              transition: { type: "spring", stiffness: 400 }
            }}
            className="mt-8"
          >
            <Link
              href={editorial.url}
              className="inline-flex items-center px-6 py-3 bg-[#1e3d2f] text-white rounded-full text-sm font-medium tracking-wider hover:bg-[#2d5c46] transition-all duration-300 group"
            >
              {editorial.cta}
              <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">
                <ArrowIcon className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Custom Icons
function PalmClusterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M240,136c0,48-64,80-112,80S16,184,16,136s64-80,112-80S240,88,240,136Z" />
    </svg>
  );
}

function ArrowIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}