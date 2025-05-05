"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Create the WishlistContext
const WishlistContext = createContext();

// Custom hook to use the WishlistContext
export const useWishlist = () => useContext(WishlistContext);

// WishlistProvider component
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      try {
        const parsedWishlist = JSON.parse(storedWishlist);
        // Validate and normalize the data
        const validatedWishlist = parsedWishlist.map(item => ({
          ...item,
          images: item.images || [],
          image: item.image || item.images?.[0]?.src || '/default-image.jpg'
        }));
        setWishlist(validatedWishlist);
      } catch (error) {
        console.error("Failed to parse wishlist:", error);
        localStorage.removeItem("wishlist");
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Enhanced addToWishlist with data normalization
  const addToWishlist = (product) => {
    if (!product.id) return;

    setWishlist((prev) => {
      // Check if product already exists
      const exists = prev.some(item => item.id === product.id);
      if (!exists) {
        // Normalize the product data before storing
        const normalizedProduct = {
          id: product.id,
          title: product.title || 'Untitled Product',
          price: product.price || '0',
          compareAtPrice: product.compareAtPrice || '0',
          // Handle both Shopify and simple image formats
          images: product.images 
            ? Array.isArray(product.images) 
              ? product.images.map(img => ({
                  url: img.url || img.src || img
                }))
              : [{ url: product.images }]
            : product.image
              ? [{ url: product.image }]
              : [],
          image: product.image || product.images?.[0]?.url || product.images?.[0]?.src,
          productType: product.productType || '',
          variants: product.variants || [],
          handle: product.handle || ''
        };
        return [...prev, normalizedProduct];
      }
      return prev;
    });
  };


  // Remove a product from the wishlist
  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== productId)
    );
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
