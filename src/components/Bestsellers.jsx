"use client";

import { motion } from "framer-motion";
import ProductGrid from "@/components/ProductGrid";
import { fetchProducts } from "@/lib/fetchProducts";
import { useState, useEffect } from "react";

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const { products } = await fetchProducts();
        
        if (!products || products.length === 0) {
          console.warn('No products received');
          return;
        }

        // Sort by newest and get first 4
        const latestProducts = [...products]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);

        setProducts(latestProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="bg-gradient-to-b from-[#FFE8D6]/30 to-[#F8E1C8]/10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#1e3d2f] mb-3"
          >
            New Arrivals
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-[#3e554a] max-w-2xl mx-auto"
          >
            Discover our newest additions
          </motion.p>
        </div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <ProductGrid 
            products={products} 
            loading={loading} 
            gridClasses="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          />
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="/shop"
            className="inline-block bg-[#1e3d2f] text-white px-8 py-3 rounded-full font-medium hover:bg-[#3e554a] transition-colors shadow-md hover:shadow-lg"
          >
            View All Products
          </a>
        </motion.div>
      </div>
    </section>
  );
}