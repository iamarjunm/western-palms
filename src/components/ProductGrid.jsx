"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

const ProductGrid = ({ products = [], loading = false }) => {
  // Loading skeleton animation
  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-16">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0.8 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
            className="bg-gray-100 rounded-xl aspect-[3/4]"
          />
        ))}
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-6 py-12 text-center">
        <h3 className="text-xl font-medium text-gray-700">No products found</h3>
        <p className="text-gray-500 mt-2">
          We couldn't find any products matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-16">
      {products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;