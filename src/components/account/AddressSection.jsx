"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiMapPin } from "react-icons/fi";

const AddressSection = ({ user, updateAddress, deleteAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
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

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("shopifyAccessToken");
        
        if (!token) {
          console.error("No access token found");
          return;
        }

        const response = await fetch("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch addresses");
        
        const userData = await response.json();
        if (userData.addresses) {
          setAddresses(userData.addresses);
        }
      } catch (error) {
        console.error("Address fetch error:", error);
        setError("Failed to load addresses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate form data
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

  // Save address handler
  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const addressToSave = {
        ...formData,
        phone: `+91 ${formData.phone}`,
        id: editId || `temp-${Date.now()}`,
      };

      let updatedAddresses;
      if (editId) {
        // Update existing address
        updatedAddresses = addresses.map(addr => 
          addr.id === editId ? addressToSave : addr
        );
      } else {
        // Add new address
        updatedAddresses = [...addresses, addressToSave];
      }

      // Handle primary address logic
      if (addressToSave.isPrimary) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isPrimary: addr.id === addressToSave.id
        }));
      } else if (updatedAddresses.length === 1) {
        // If this is the only address, make it primary
        updatedAddresses[0].isPrimary = true;
        addressToSave.isPrimary = true;
      }

      setAddresses(updatedAddresses);
      
      // Call update API
      if (updateAddress) {
        await updateAddress(addressToSave);
      }

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Address save error:", error);
      setError("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete address handler
  const handleDeleteAddress = async (addressId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (!confirmDelete) return;

    try {
      await deleteAddress(addressId);
      
      // Remove from local state
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);

      // If we deleted the primary address and there are others left, make the first one primary
      if (updatedAddresses.length > 0 && 
          !updatedAddresses.some(addr => addr.isPrimary)) {
        const newAddresses = [...updatedAddresses];
        newAddresses[0].isPrimary = true;
        setAddresses(newAddresses);
        
        // Update in backend
        if (updateAddress) {
          await updateAddress(newAddresses[0]);
        }
      }
    } catch (error) {
      console.error("Address delete error:", error);
      setError("Failed to delete address. Please try again.");
    }
  };

  // Edit existing address
  const handleEditAddress = (address) => {
    setEditId(address.id);
    setFormData({
      ...address,
      phone: address.phone.replace(/^\+91\s/, "") // Remove country code
    });
    setIsEditing(true);
  };

  // Add new address
  const handleAddNewAddress = () => {
    setEditId(null);
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

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
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
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#1e3d2f] mb-6">Address Book</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center">
          <FiX className="mr-2" />
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-6 mb-6">
          <h3 className="text-lg font-medium text-[#1e3d2f] flex items-center mb-4">
            <FiMapPin className="mr-2" />
            {editId ? "Edit Address" : "Add New Address"}
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
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

              {/* Last Name */}
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

            {/* Company */}
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

            {/* Address Line 1 */}
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

            {/* Address Line 2 */}
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
              {/* City */}
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

              {/* State */}
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

              {/* ZIP Code */}
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

            {/* Phone */}
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

            {/* Country */}
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

            <div className="flex gap-3 pt-4">
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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="bg-white text-[#1e3d2f] border border-[#1e3d2f] px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center"
              >
                <FiX className="mr-2" />
                Cancel
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {addresses.length > 0 ? (
              [...addresses].sort((a, b) => b.isPrimary - a.isPrimary).map((address) => (
                <div 
                  key={address.id} 
                  className={`bg-white/80 backdrop-blur-md rounded-xl shadow-sm border ${
                    address.isPrimary ? "border-[#4ECDC4]" : "border-white/20"
                  } p-6`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <FiMapPin className="mr-2 text-[#3e554a]" />
                        <h3 className="text-lg font-medium text-[#1e3d2f]">
                          {address.firstName} {address.lastName}
                          {address.isPrimary && (
                            <span className="ml-2 text-sm text-[#4ECDC4]">(Primary)</span>
                          )}
                        </h3>
                      </div>
                      <p className="text-[#3e554a]">
                        {address.address1}, {address.address2 && `${address.address2}, `}
                        {address.city}, {address.province}, {address.zip}
                      </p>
                      <p className="text-[#3e554a] mt-1">Phone: {address.phone}</p>
                      {address.company && (
                        <p className="text-[#3e554a] mt-1">Company: {address.company}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditAddress(address)}
                        className="text-[#3e554a] hover:text-[#1e3d2f] flex items-center text-sm"
                      >
                        <FiEdit2 className="mr-1" size={14} />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-500 hover:text-red-700 flex items-center text-sm"
                      >
                        <FiTrash2 className="mr-1" size={14} />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-6 text-center">
                <p className="text-[#3e554a]">No addresses saved yet.</p>
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddNewAddress}
            className="bg-[#1e3d2f] text-white px-6 py-3 rounded-md font-medium hover:bg-[#3e554a] transition-colors flex items-center mx-auto"
          >
            <FiPlus className="mr-2" />
            Add New Address
          </motion.button>
        </>
      )}
    </div>
  );
};

export default AddressSection;