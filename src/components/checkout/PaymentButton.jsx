"use client";

import React from "react";
import { motion } from "framer-motion";

const PaymentButton = ({ 
  loading, 
  onClick,
  cart = [],
  razorpayLoaded = false
}) => {
  const isRazorpayReady = razorpayLoaded && typeof window.Razorpay !== 'undefined';
  const isDisabled = loading || cart.length === 0 || !isRazorpayReady;
  
  let tooltipMessage = '';
  
  if (loading) {
    tooltipMessage = 'Processing your order...';
  } else if (cart.length === 0) {
    tooltipMessage = 'Your cart is empty';
  } else if (!isRazorpayReady) {
    tooltipMessage = 'Payment system loading...';
  }

  const handleClick = (e) => {
    e.preventDefault();
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  return (
    <div className="md:col-span-2 text-center relative group">
      <motion.button
        type="button"
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        className={`bg-[#1e3d2f] text-white py-4 px-8 rounded-md text-lg font-medium transition-colors ${
          isDisabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-[#3e554a]'
        }`}
        disabled={isDisabled}
        onClick={handleClick}
        aria-label={tooltipMessage}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          "Place Order"
        )}
      </motion.button>

      {/* Tooltip for disabled state */}
      {isDisabled && !loading && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#1e3d2f] text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {tooltipMessage}
          <div className="absolute top-full left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-[#1e3d2f] border-transparent transform -translate-x-1/2"></div>
        </div>
      )}
    </div>
  );
};

export default PaymentButton;