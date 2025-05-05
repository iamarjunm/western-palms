"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiX } from "react-icons/fi";
import Link from "next/link";

const ShippingAddressForm = ({ user, onSubmit, initialAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("shopifyAccessToken");
        
        if (!token && user) {
          setError("Please log in to manage addresses");
          setLoaded(true);
          return;
        }

        if (token) {
          const response = await fetch("/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) throw new Error("Failed to fetch addresses");
          
          const userData = await response.json();
          if (userData.addresses) {
            setAddresses(userData.addresses);
            
            const addressToSelect = initialAddress || 
                                 userData.addresses.find(addr => addr.isPrimary) || 
                                 userData.addresses[0];
            if (addressToSelect) {
              setSelectedAddress(addressToSelect);
              onSubmit(addressToSelect);
            }
          }
        }
      } catch (error) {
        console.error("Address fetch error:", error);
        setError("Failed to load addresses. Please try again.");
      } finally {
        setLoading(false);
        setLoaded(true);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    onSubmit(address);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-6">
      <h2 className="text-xl font-bold text-[#1e3d2f] mb-6 flex items-center">
        <FiMapPin className="mr-2" />
        Shipping Address
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center">
          <FiX className="mr-2" />
          {error}
        </div>
      )}

      {loading && !loaded && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1e3d2f]"></div>
        </div>
      )}

      {user && loaded && (
        <>
          {addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 rounded-xl border ${
                    selectedAddress?.id === address.id 
                      ? "border-[#4ECDC4] bg-[#FFE8D6]/20" 
                      : "border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-1">
                        <p className="font-medium text-[#1e3d2f]">
                          {address.firstName} {address.lastName}
                          {address.isPrimary && (
                            <span className="ml-2 text-sm text-[#4ECDC4]">(Primary)</span>
                          )}
                        </p>
                      </div>
                      <p className="text-[#3e554a] text-sm">
                        {address.address1}, {address.address2 && `${address.address2}, `}
                        {address.city}, {address.province}, {address.zip}
                      </p>
                      <p className="text-[#3e554a] text-sm mt-1">Phone: {address.phone}</p>
                    </div>
                    <div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelectAddress(address)}
                        className={`px-3 py-1 text-sm rounded-md text-sm ${
                          selectedAddress?.id === address.id
                            ? "bg-[#1e3d2f] text-white"
                            : "bg-white text-[#1e3d2f] border border-[#d1d9d5]"
                        }`}
                      >
                        {selectedAddress?.id === address.id ? "Selected" : "Select"}
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="mb-4 text-[#3e554a]">No saved addresses found.</p>
              <Link href="/account" className="bg-[#1e3d2f] text-white px-6 py-2 rounded-md font-medium hover:bg-[#3e554a] transition-colors inline-block">
                Add Address in Account
              </Link>
            </div>
          )}
        </>
      )}

      {!user && loaded && (
        <div className="text-center py-4">
          <p className="mb-4 text-[#3e554a]">Please log in to select an address.</p>
        </div>
      )}
    </div>
  );
};

export default ShippingAddressForm;