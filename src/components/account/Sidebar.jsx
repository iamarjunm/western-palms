"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiUser, FiHome, FiPackage, FiLock, FiLogOut } from "react-icons/fi";

const Sidebar = ({ activeSection, setActiveSection, handleLogout }) => {
  const menuItems = [
    { id: "profile", label: "Profile", icon: <FiUser className="mr-3" /> },
    { id: "address", label: "Address", icon: <FiHome className="mr-3" /> },
    { id: "orders", label: "Orders", icon: <FiPackage className="mr-3" /> },
    { id: "password", label: "Password", icon: <FiLock className="mr-3" /> },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6 h-fit sticky top-6">
      <h2 className="text-2xl font-bold text-[#1e3d2f] mb-6">My Account</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-[#FFE8D6] to-[#F8E1C8] text-[#1e3d2f] font-medium"
                  : "text-[#3e554a] hover:bg-white/50"
              }`}
            >
              {item.icon}
              {item.label}
            </motion.button>
          </li>
        ))}
        <li className="border-t border-[#d1d9d5] pt-2 mt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="mr-3" />
            Logout
          </motion.button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;