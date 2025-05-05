"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submission logic here
    setSubmitted(true);
  };

  return (
    <section className="relative py-32 bg-gradient-to-br from-[#e8e0d5] to-[#f7f3ee]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {!submitted ? (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "0px 0px -50px 0px", once: true }}
              className="text-4xl sm:text-5xl font-medium text-[#1e3d2f] mb-6"
            >
              Join the Western Palms Circle
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ margin: "0px 0px -50px 0px", once: true }}
              className="text-lg text-[#3e554a] mb-10 max-w-2xl mx-auto"
            >
              Receive exclusive early access to new collections, private sales, 
              and seasonal styling guides.
            </motion.p>
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ margin: "0px 0px -50px 0px", once: true }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-6 py-4 bg-white/80 border border-[#e4dfd7] rounded-full focus:outline-none focus:ring-2 focus:ring-[#1e3d2f] focus:border-transparent text-[#1e3d2f] placeholder-[#3e554a]/50"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[#1e3d2f] text-white rounded-full hover:bg-[#2d5c46] transition-all font-medium"
              >
                Subscribe
              </button>
            </motion.form>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ margin: "0px 0px -50px 0px", once: true }}
              className="text-xs text-[#3e554a]/70 mt-4"
            >
              We respect your privacy. Unsubscribe at any time.
            </motion.p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 p-12 rounded-3xl shadow-sm"
          >
            <h3 className="text-3xl font-medium text-[#1e3d2f] mb-4">
              Welcome to the Circle
            </h3>
            <p className="text-[#3e554a] mb-6">
              Thank you for joining us! Your first exclusive preview is on its way.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-3 border border-[#1e3d2f] text-[#1e3d2f] rounded-full hover:bg-[#1e3d2f] hover:text-white transition-all text-sm font-medium"
            >
              Back to Site
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}