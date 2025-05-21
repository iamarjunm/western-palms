"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function ContactPage() {
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: false });

  const satisfactionCount = useMotionValue(0);
  const roundedSatisfaction = useTransform(satisfactionCount, Math.round);

  useEffect(() => {
    if (inView) {
      animate(satisfactionCount, 98, { duration: 3 });
    }
  }, [inView]);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] },
    },
  };

  const title2 = "Connect With Us";

  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-[#FFF5E6] via-[#FFE8D6] to-[#F8E1C8]"
    >
      {/* Background floating blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => {
          const colors = ["#FF6B6B", "#4ECDC4", "#FFBE0B", "#8338EC", "#3A86FF"];
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
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              }}
              animate={{
                y: [0, Math.random() * 200 - 100],
                x: [0, Math.random() * 200 - 100],
                rotate: [0, Math.random() * 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20 + Math.random() * 40,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Animated heading */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={textVariants}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-4">
            <motion.span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#8338EC]">
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
            <motion.span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#3A86FF] to-[#4ECDC4]">
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
            className="text-xl text-[#5A5A5A] max-w-2xl mx-auto"
          >
            We'd love to hear from you! Reach out for styling advice, order help, or just to say hello.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
          <div className="space-y-8 mx-auto max-w-2xl">
            {/* Satisfaction Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8"
            >
              <div className="flex items-start gap-4">
                <div className="bg-[#FFE8D6] p-3 rounded-full">
                  <FiMail className="text-2xl text-[#FF6B6B]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1e3d2f] mb-2">Our Promise</h3>
                  <p className="text-[#3e554a] mb-4">
                    We respond to all inquiries within 24 hours. Your satisfaction is our priority.
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#FFBE0B]">
                      <motion.span>{roundedSatisfaction}</motion.span>%
                    </p>
                    <p className="text-sm text-[#3e554a]">Customer<br/>Satisfaction</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8"
            >
              <h3 className="text-xl font-bold text-[#1e3d2f] mb-6">Ways to Connect</h3>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="bg-[#FFE8D6] p-3 rounded-full flex-shrink-0">
                    <FiMail className="text-2xl text-[#FF6B6B]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3d2f]">Email Us</h4>
                    <a
                      href="mailto:westernpalms29@gmail.com"
                      className="text-[#3e554a] hover:text-[#FF6B6B] block transition-colors"
                    >
                      westernpalms29@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="bg-[#FFE8D6] p-3 rounded-full flex-shrink-0">
                    <FiPhone className="text-2xl text-[#3A86FF]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3d2f]">Whatsapp Us</h4>
                    <p className="text-[#3e554a]">+91 9599296553</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="bg-[#FFE8D6] p-3 rounded-full flex-shrink-0">
                    <FiMapPin className="text-2xl text-[#8338EC]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1e3d2f]">Visit Us</h4>
                    <p className="text-[#3e554a]">T-510/C, 10/2 Bajeet Nagar, Delhi - 110008</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom cactus border */}
      <div className="h-16 bg-[#3e554a] flex items-center justify-center overflow-hidden">
        <motion.div
          className="flex gap-8 text-3xl text-[#FFE8D6]"
          animate={{
            x: [0, -100],
            transition: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          {[...Array(10)].map((_, i) => (
            <span key={i}>🌵</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
