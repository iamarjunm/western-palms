"use client";

import { motion } from "framer-motion";
import { FiXCircle, FiAlertTriangle, FiShoppingBag } from "react-icons/fi";

const ReturnPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-8"
        >
          {/* Policy Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center text-red-500 mb-4">
              <FiXCircle size={48} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1e3d2f] mb-3">
              Strict No Return, No Exchange Policy
            </h1>
            <p className="text-lg text-[#3e554a]">
              Please review carefully before placing your order
            </p>
          </div>

          {/* Main Policy Section */}
          <div className="space-y-8">
            {/* Policy Explanation */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-red-50/50 border-l-4 border-red-500 p-6 rounded-r-lg"
            >
              <div className="flex items-start">
                <FiAlertTriangle className="text-red-500 text-2xl mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-[#1e3d2f] mb-2">
                    All Sales Are Final
                  </h3>
                  <p className="text-[#3e554a]">
                    Due to the nature of our handcrafted products, we <strong>do not accept returns, exchanges, or cancellations</strong> after order confirmation. We carefully inspect each item before shipping to ensure quality.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Reasons */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#d1d9d5]">
              <h3 className="text-xl font-bold text-[#1e3d2f] mb-4 flex items-center">
                <FiShoppingBag className="mr-3" />
                Why This Policy Exists
              </h3>
              <ul className="space-y-4 text-[#3e554a]">
                <li className="flex items-start">
                  <span className="bg-[#1e3d2f] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                  <span><strong>Handcrafted Nature:</strong> Each piece is uniquely made-to-order with materials specifically sourced for your item.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#1e3d2f] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                  <span><strong>Hygiene Reasons:</strong> For health and safety, we cannot accept returns of personal items.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#1e3d2f] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                  <span><strong>Custom Work:</strong> Many items are personalized or customized per your specifications.</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;