"use client";

import React from "react";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/context/WishlistContext";

const Wishlist = () => {
  const { wishlist } = useWishlist();

  // Normalize wishlist items to match ProductCard expectations
  const normalizedWishlist = wishlist.map(item => ({
    ...item,
    // Ensure images array exists and is properly formatted
    images: Array.isArray(item.images) 
      ? item.images.map(img => (typeof img === 'string' ? { url: img } : img))
      : item.image 
        ? [{ url: item.image }]
        : [],
    // Ensure variants exist if needed by ProductCard
    variants: item.variants || [],
    // Add any other required fields with fallbacks
    productType: item.productType || '',
    priceRange: item.priceRange || {
      minVariantPrice: { amount: item.price || '0' }
    },
    compareAtPriceRange: item.compareAtPriceRange || {
      minVariantPrice: { amount: item.compareAtPrice || '0' }
    }
  }));

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Wishlist</h1>
      
      {normalizedWishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {normalizedWishlist.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              // Disable quick view if needed
              disableQuickView={true} 
            />
          ))}
        </div>
      ) : (
        <p className="text-xl text-gray-400">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;