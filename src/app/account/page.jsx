"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/account/Sidebar";
import ProfileSection from "@/components/account/ProfileSection";
import AddressSection from "@/components/account/AddressSection";
import OrdersSection from "@/components/account/OrdersSection";
import PasswordSection from "@/components/account/PasswordSection";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import Link from 'next/link';


const AccountPage = () => {
  const { user, loading, updateAddress, logout, updatePhone, updateName, updatePassword, deleteAddress } = useUser();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("profile");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold text-[#1e3d2f] mb-4">Login Required</h2>
          <p className="text-[#3e554a] mb-6">You must be logged in to view your account.</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-[#1e3d2f] text-white px-6 py-2 rounded-md font-medium hover:bg-[#3e554a] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-white text-[#1e3d2f] border border-[#1e3d2f] px-6 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-8"
        >
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Sidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              handleLogout={handleLogout}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-6">
              {activeSection === "profile" && (
                <ProfileSection
                  user={user}
                  updateName={updateName}
                  updatePhone={updatePhone}
                />
              )}
              {activeSection === "address" && (
                <AddressSection
                  user={user}
                  updateAddress={updateAddress}
                  deleteAddress={deleteAddress}
                />
              )}
              {activeSection === "orders" && <OrdersSection />}
              {activeSection === "password" && (
                <PasswordSection
                  updatePassword={updatePassword}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountPage;