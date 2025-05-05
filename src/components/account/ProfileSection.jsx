"use client";

import React, { useState } from "react";
import PhoneInput from "../PhoneInput";
import { motion } from "framer-motion";
import { FiUser, FiEdit2, FiSave, FiX, FiMail, FiPhone } from "react-icons/fi";

const ProfileSection = ({ user, updateName, updatePhone }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newFirstName, setNewFirstName] = useState(user?.firstName || "");
  const [newLastName, setNewLastName] = useState(user?.lastName || "");
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const handleSaveName = async () => {
    await updateName(newFirstName, newLastName);
    setIsEditingName(false);
  };

  const handlePhoneSubmit = async (phoneData) => {
    await updatePhone(phoneData);
    setIsEditingPhone(false);
  };

  const handleCancelName = () => {
    setNewFirstName(user?.firstName || "");
    setNewLastName(user?.lastName || "");
    setIsEditingName(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#1e3d2f] mb-6">Profile Information</h2>
      
      {/* Name Section */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-[#1e3d2f] flex items-center">
            <FiUser className="mr-2" />
            Full Name
          </h3>
          {!isEditingName && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditingName(true)}
              className="text-[#3e554a] hover:text-[#1e3d2f] flex items-center text-sm"
            >
              <FiEdit2 className="mr-1" size={14} />
              Edit
            </motion.button>
          )}
        </div>

        {isEditingName ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#3e554a] mb-1">First Name</label>
                <input
                  type="text"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-[#3e554a] mb-1">Last Name</label>
                <input
                  type="text"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveName}
                className="bg-[#1e3d2f] text-white px-4 py-2 rounded-md font-medium hover:bg-[#3e554a] transition-colors flex items-center"
              >
                <FiSave className="mr-2" />
                Save Changes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancelName}
                className="bg-white text-[#1e3d2f] border border-[#1e3d2f] px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center"
              >
                <FiX className="mr-2" />
                Cancel
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <p className="text-lg text-[#1e3d2f]">{user.firstName} {user.lastName}</p>
        )}
      </div>

      {/* Email Section */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-6 mb-6">
        <div className="flex items-center mb-2">
          <FiMail className="mr-2 text-[#3e554a]" />
          <h3 className="text-lg font-medium text-[#1e3d2f]">Email</h3>
        </div>
        <p className="text-[#3e554a]">{user.email}</p>
      </div>

      {/* Phone Section */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-[#1e3d2f] flex items-center">
            <FiPhone className="mr-2" />
            Phone Number
          </h3>
          {!isEditingPhone && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditingPhone(true)}
              className="text-[#3e554a] hover:text-[#1e3d2f] flex items-center text-sm"
            >
              <FiEdit2 className="mr-1" size={14} />
              Edit
            </motion.button>
          )}
        </div>

        {isEditingPhone ? (
          <PhoneInput 
            onSubmit={handlePhoneSubmit}
            onCancel={() => setIsEditingPhone(false)}
            initialPhone={user?.phone}
            initialCountryCode={user?.countryCode}
          />
        ) : (
          <p className="text-[#3e554a]">{user.phone || "Not provided"}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;