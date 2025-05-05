"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiLock, FiEdit2, FiSave, FiX } from "react-icons/fi";

const PasswordSection = ({ updatePassword }) => {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError("");
    setLoading(true);
    
    try {
      await updatePassword(currentPassword, newPassword);
      setIsEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#1e3d2f] mb-6">Password Settings</h2>
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-6">
        {isEditingPassword ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-[#1e3d2f] flex items-center">
              <FiLock className="mr-2" />
              Change Your Password
            </h3>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md flex items-center">
                <FiX className="mr-2" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-[#3e554a] mb-1">Current Password *</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#3e554a] mb-1">New Password *</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <p className="text-xs text-[#3e554a] mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm text-[#3e554a] mb-1">Confirm New Password *</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSavePassword}
                disabled={loading}
                className="bg-[#1e3d2f] text-white px-4 py-2 rounded-md font-medium hover:bg-[#3e554a] transition-colors flex items-center"
              >
                <FiSave className="mr-2" />
                {loading ? "Saving..." : "Save Password"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="bg-white text-[#1e3d2f] border border-[#1e3d2f] px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center"
              >
                <FiX className="mr-2" />
                Cancel
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FiLock className="text-[#3e554a] mr-3" size={20} />
              <span className="text-[#1e3d2f]">Password</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditingPassword(true)}
              className="text-[#3e554a] hover:text-[#1e3d2f] flex items-center text-sm"
            >
              <FiEdit2 className="mr-1" size={14} />
              Change Password
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordSection;