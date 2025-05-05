"use client";

import { motion } from "framer-motion";
import { FiChevronDown, FiShoppingBag, FiTruck, FiCreditCard, FiMail } from "react-icons/fi";
import { useState } from "react";

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What are your shipping options and timelines?",
      answer: "We ship nationwide via Delhivery with standard delivery in 3-7 business days. Metro cities typically receive orders in 3-5 days, while remote areas may take up to 7 days. All orders are dispatched within 24-48 hours.",
      icon: <FiTruck className="text-[#1e3d2f] mr-4 text-xl" />
    },
    {
      question: "What is your return/exchange policy?",
      answer: "We have a strict no return, no exchange policy due to the handcrafted nature of our products. Exceptions are made only for items damaged in transit, which must be reported within 24 hours of delivery with photographic evidence.",
      icon: <FiShoppingBag className="text-[#1e3d2f] mr-4 text-xl" />
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI payments, net banking, and popular digital wallets. Please note we only accept prepaid orders - cash on delivery is not available.",
      icon: <FiCreditCard className="text-[#1e3d2f] mr-4 text-xl" />
    },
    {
      question: "How can I track my order?",
      answer: "You'll receive a Delhivery tracking number via SMS and email once your order is dispatched. You can track your package directly on Delhivery's website or through the tracking link in your order confirmation email.",
      icon: <FiTruck className="text-[#1e3d2f] mr-4 text-xl" />
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we only ship within India. We're working to expand our shipping options in the future - please check back or follow our social media for updates.",
      icon: <FiShoppingBag className="text-[#1e3d2f] mr-4 text-xl" />
    },
    {
      question: "How can I contact customer support?",
      answer: "For any queries, please email westernpalms29@gmail.com with your order number. Our team responds within 24 hours on business days (Monday-Friday, 10AM-6PM IST).",
      icon: <FiMail className="text-[#1e3d2f] mr-4 text-xl" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-8"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1e3d2f] mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-[#3e554a]">
              Find answers to common questions about our products and policies
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.01 }}
                className="border border-[#d1d9d5] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full flex items-center justify-between p-6 text-left ${activeIndex === index ? 'bg-[#FFE8D6]' : 'bg-white'}`}
                >
                  <div className="flex items-center">
                    {faq.icon}
                    <h3 className="text-lg font-medium text-[#1e3d2f]">
                      {faq.question}
                    </h3>
                  </div>
                  <FiChevronDown 
                    className={`text-[#1e3d2f] transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: activeIndex === index ? 'auto' : 0,
                    opacity: activeIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 bg-white text-[#3e554a] border-t border-[#d1d9d5]">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center border-t border-[#d1d9d5] pt-8">
            <h3 className="text-xl font-bold text-[#1e3d2f] mb-4">
              Still have questions?
            </h3>
            <p className="text-[#3e554a] mb-6">
              Contact our customer support team and we'll be happy to help.
            </p>
            <a
              href="mailto:westernpalms29@gmail.com"
              className="inline-block bg-[#1e3d2f] text-white px-8 py-3 rounded-md font-medium hover:bg-[#3e554a] transition-colors"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;