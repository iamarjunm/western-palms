import React from "react";
import { FiUser, FiMail } from "react-icons/fi";

const UserInformationForm = ({ formData, handleChange, user }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-6">
      <h2 className="text-xl font-bold text-[#1e3d2f] mb-6 flex items-center">
        <FiUser className="mr-2" />
        User Information
      </h2>
      
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm text-[#3e554a] mb-1">Full Name *</label>
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent ${
                user ? "bg-gray-50" : ""
              }`}
              required
              readOnly={!!user}
            />
            {user && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#3e554a]">
                <span className="text-xs">Saved</span>
              </div>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-[#3e554a] mb-1">Email *</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent ${
                user ? "bg-gray-50" : ""
              }`}
              required
              readOnly={!!user}
            />
            {user && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FiMail className="text-[#3e554a]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInformationForm;