"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiX } from 'react-icons/fi';

const PhoneInput = ({ 
  onSubmit,
  onCancel,
  initialPhone = '',
  initialCountryCode = '+91'
}) => {
  const [phoneData, setPhoneData] = useState({
    countryCode: '+91', // Fixed to India (+91)
    phone: initialPhone.replace('+91', '') // Remove country code if present
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { value } = e.target;
    // Ensure only numbers are entered
    if (/^\d*$/.test(value)) {
      setPhoneData(prev => ({
        ...prev,
        phone: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        countryCode: '+91', // Always submit with +91
        phone: phoneData.phone
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <label className="block text-sm text-[#3e554a] mb-1">
            Country Code
          </label>
          <div className="flex items-center h-10 px-3 rounded-md bg-white/50 border border-[#d1d9d5] text-[#1e3d2f]">
            +91 (India)
          </div>
        </div>
        <div className="col-span-9">
          <label className="block text-sm text-[#3e554a] mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneData.phone}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-md bg-white/50 border border-[#d1d9d5] text-[#1e3d2f] focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
            placeholder="9876543210"
            required
            pattern="[0-9]{10}"
            maxLength="10"
            title="Please enter a 10-digit Indian phone number"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-[#1e3d2f] text-white px-4 py-2 rounded-md font-medium hover:bg-[#3e554a] transition-colors flex items-center disabled:opacity-50"
        >
          <FiSave className="mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </motion.button>
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white text-[#1e3d2f] border border-[#1e3d2f] px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center"
        >
          <FiX className="mr-2" />
          Cancel
        </motion.button>
      </div>
    </form>
  );
};

export default PhoneInput;