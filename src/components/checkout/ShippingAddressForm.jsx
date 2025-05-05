"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiEdit2, FiPlus, FiX, FiCheck, FiTrash2 } from "react-icons/fi";

const ShippingAddressForm = ({ user, updateAddress, onSubmit, initialAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    company: "",
    address1: "",
    address2: "",
    city: "",
    country: "India",
    province: "",
    zip: "",
    phone: user?.phone || "",
    isPrimary: false,
  });

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

            setIsEditing(userData.addresses.length === 0);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'firstName', 'lastName', 'address1', 
      'city', 'province', 'zip', 'phone'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        setError(`Please fill in the ${field} field`);
        return false;
      }
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be 10 digits");
      return false;
    }

    if (!/^\d{6}$/.test(formData.zip)) {
      setError("ZIP code must be 6 digits");
      return false;
    }

    setError("");
    return true;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const addressToSave = {
        ...formData,
        phone: `+91 ${formData.phone}`,
        id: selectedAddress?.id || `temp-${Date.now()}`,
      };

      onSubmit({
        firstName: addressToSave.firstName,
        lastName: addressToSave.lastName,
        company: addressToSave.company,
        address1: addressToSave.address1,
        address2: addressToSave.address2,
        city: addressToSave.city,
        country: addressToSave.country,
        province: addressToSave.province,
        zip: addressToSave.zip,
        phone: formData.phone,
      });

      if (user) {
        let updatedAddresses;
        
        if (selectedAddress) {
          updatedAddresses = addresses.map(addr => 
            addr.id === selectedAddress.id ? addressToSave : addr
          );
        } else {
          updatedAddresses = [...addresses, addressToSave];
        }

        if (addressToSave.isPrimary) {
          updatedAddresses = updatedAddresses.map(addr => ({
            ...addr,
            isPrimary: addr.id === addressToSave.id
          }));
        }

        setAddresses(updatedAddresses);
        
        if (updateAddress) {
          await updateAddress(addressToSave);
        }
      }

      onSubmit(addressToSave);
      
      if (!selectedAddress) {
        setFormData({
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          company: "",
          address1: "",
          address2: "",
          city: "",
          country: "India",
          province: "",
          zip: "",
          phone: user?.phone || "",
          isPrimary: false,
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Address save error:", error);
      setError("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    onSubmit(address);
    setIsEditing(false);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setFormData({
      ...address,
      phone: address.phone.replace(/^\+91\s/, "")
    });
    setIsEditing(true);
  };

  const handleAddNewAddress = () => {
    setSelectedAddress(null);
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      country: "India",
      province: "",
      zip: "",
      phone: user?.phone || "",
      isPrimary: false,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError("");
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
          {!isEditing && addresses.length > 0 ? (
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
                    <div className="flex gap-2">
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
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditAddress(address)}
                        className="px-3 py-1 text-sm bg-white text-[#1e3d2f] border border-[#d1d9d5] rounded-md"
                      >
                        <FiEdit2 size={14} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddNewAddress}
                className="w-full mt-4 bg-[#1e3d2f] text-white py-2 rounded-md font-medium hover:bg-[#3e554a] transition-colors flex items-center justify-center"
              >
                <FiPlus className="mr-2" />
                Add New Address
              </motion.button>
            </div>
          ) : !isEditing ? (
            <div className="text-center py-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddNewAddress}
                className="bg-[#1e3d2f] text-white px-6 py-2 rounded-md font-medium hover:bg-[#3e554a] transition-colors"
              >
                Add New Address
              </motion.button>
            </div>
          ) : null}
        </>
      )}

      {(isEditing || !user) && loaded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#3e554a] mb-1">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#3e554a] mb-1">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#3e554a] mb-1">Company (Optional)</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-[#3e554a] mb-1">Address *</label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#3e554a] mb-1">Apartment, Suite, etc. (Optional)</label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[#3e554a] mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#3e554a] mb-1">State *</label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#3e554a] mb-1">ZIP Code *</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                required
                maxLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#3e554a] mb-1">Phone *</label>
            <div className="flex">
              <div className="w-1/4">
                <input
                  type="text"
                  value="+91"
                  readOnly
                  className="w-full px-4 py-2 border border-[#d1d9d5] rounded-l-md bg-gray-50"
                />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-3/4 px-4 py-2 border border-[#d1d9d5] rounded-r-md focus:ring-2 focus:ring-[#4ECDC4] focus:border-transparent"
                required
                maxLength={10}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#3e554a] mb-1">Country *</label>
            <input
              type="text"
              name="country"
              value="India"
              readOnly
              className="w-full px-4 py-2 border border-[#d1d9d5] rounded-md bg-gray-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {user && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="bg-white text-[#1e3d2f] border border-[#1e3d2f] px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center"
              >
                <FiX className="mr-2" />
                Cancel
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveAddress}
              disabled={loading}
              className="bg-[#1e3d2f] text-white px-4 py-2 rounded-md font-medium hover:bg-[#3e554a] transition-colors flex items-center"
            >
              <FiCheck className="mr-2" />
              {loading ? "Saving..." : "Save Address"}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingAddressForm;