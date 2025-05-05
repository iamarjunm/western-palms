"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { FiTruck, FiTag, FiCheckCircle, FiGlobe } from "react-icons/fi";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function AboutPage() {
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false
  });

  // Animated counters
  const stylesCount = useMotionValue(0);
  const countriesCount = useMotionValue(0);
  const happyCustomersCount = useMotionValue(0);
  
  const roundedStyles = useTransform(stylesCount, Math.round);
  const roundedCountries = useTransform(countriesCount, Math.round);
  const roundedCustomers = useTransform(happyCustomersCount, Math.round);

  useEffect(() => {
    if (inView) {
      animate(stylesCount, 1000, { duration: 2.5 });
      animate(countriesCount, 25, { duration: 3 });
      animate(happyCustomersCount, 500000, { duration: 3.5 });
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
  const title1 = "Our Desert";
  const title2 = "Fashion Oasis";

  return (
    <div 
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-[#FFF5E6] via-[#FFE8D6] to-[#F8E1C8]"
    >
      {/* Floating desert elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => {
          const colors = ["#FF6B6B", "#4ECDC4", "#FFBE0B", "#8338EC", "#3A86FF"];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const size = Math.random() * 200 + 50;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-multiply opacity-10"
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
                duration: 20 + Math.random() * 40,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero Section */}
        <section className="mb-24">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={textVariants}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-4">
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
              transition={{ delay: 0.8 }}
              className="text-xl text-[#5A5A5A] max-w-3xl mx-auto"
            >
              Where desert inspiration meets global fashion
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/images/Western.png"
                  alt="Western Palms Team"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-[#1e3d2f]">Our Story</h2>
              <p className="text-lg text-[#3e554a]">
                WESTERN PALMS is a global fashion and lifestyle online retailer committed to making the beauty of fashion accessible to all. We believe that the beauty of fashion should be accessible to everyone, not just the privileged few.
              </p>
              <p className="text-lg text-[#3e554a]">
                We meet our customers where they are: on mobile devices, online and on social media. We engage customers by providing multiple content streams directly within the WESTERN PALMS platform and delivering the best online shopping experience.
              </p>
              <p className="text-lg text-[#3e554a]">
                We ensure the vastness of the choices we offer are driven by our core proposition of hand picked trends, honest pricing, free shipping & assured quality.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6"
              >
                <Link
                  href="/shop"
                  className="inline-block bg-gradient-to-r from-[#FF6B6B] to-[#FFBE0B] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all shadow-lg"
                >
                  Shop Our Collections
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="my-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 border border-white/30"
          >
            <h2 className="text-3xl font-bold text-[#1e3d2f] mb-6">Our Mission</h2>
            <p className="text-xl text-[#3e554a] mb-6">
              We believe that the clothes we wear reflect our personalities and we want to empower everyone to explore and express their individuality. To do this, WESTERN PALMS creates a wide range of options to fit any mood or occasion.
            </p>
            <p className="text-xl text-[#3e554a]">
              Our mission is to serve as a leader in the industry and bring fashion into the modern era. We will try our best to deliver the products quickly to anywhere in India.
            </p>
          </motion.div>
        </section>

        {/* Values Section */}
        <section className="my-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3d2f] mb-4">Our Core Values</h2>
            <p className="text-xl text-[#3e554a] max-w-3xl mx-auto">
              The principles that guide every stitch we create
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiGlobe className="text-4xl text-[#3A86FF]" />,
                title: "Global Inspiration",
                description: "Drawing fashion inspiration from deserts worldwide to create unique styles"
              },
              {
                icon: <FiTag className="text-4xl text-[#FF6B6B]" />,
                title: "Honest Pricing",
                description: "Premium quality at fair prices without hidden costs"
              },
              {
                icon: <FiTruck className="text-4xl text-[#4ECDC4]" />,
                title: "Swift Delivery",
                description: "Fast shipping across India with careful packaging"
              },
              {
                icon: <FiCheckCircle className="text-4xl text-[#FFBE0B]" />,
                title: "Quality Assurance",
                description: "Every garment hand-checked before shipping"
              },
              {
                icon: "🌵",
                title: "Desert Spirit",
                description: "Embracing the free-spirited energy of the southwest"
              },
              {
                icon: "✨",
                title: "Inclusivity",
                description: "Fashion for every body type and personal style"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-[#1e3d2f] mb-2">{value.title}</h3>
                <p className="text-[#3e554a]">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-24 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#FFE8D6] to-[#F8E1C8] rounded-3xl p-12 border-2 border-white shadow-lg"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3d2f] mb-4">Join Our Desert Fashion Tribe</h2>
            <p className="text-xl text-[#3e554a] max-w-2xl mx-auto mb-8">
              Discover your perfect style with our handpicked collections
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/shop"
                className="inline-block bg-gradient-to-r from-[#FF6B6B] to-[#FFBE0B] text-white px-10 py-4 rounded-full font-bold hover:opacity-90 transition-all shadow-lg text-lg"
              >
                Start Shopping Now
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}