"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import ProductGrid from "@/components/ProductGrid";
import { fetchProducts, fetchProductsByCategory } from "@/lib/fetchProducts";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);

  // Manually defined categories
  const categories = [
    { label: "All", href: "/shop" },
    { label: "Dresses", href: "/shop?category=dresses" },
    { label: "Tops", href: "/shop?category=tops" },
    { label: "T-Shirts", href: "/shop?category=t-shirts" },
    { label: "Shirts", href: "/shop?category=shirts" },
    { label: "Tank Tops", href: "/shop?category=tank-tops" },
    { label: "Co-ords", href: "/shop?category=co-ords" },
    { label: "Jeans", href: "/shop?category=jeans" },
    { label: "Pants", href: "/shop?category=pants" },
    { label: "Shorts", href: "/shop?category=shorts" },
    { label: "Skirts", href: "/shop?category=skirts" }
  ];

  // Get category from URL
  const urlCategory = searchParams.get('category');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        if (urlCategory) {
          // Fetch products by category
          const result = await fetchProductsByCategory(urlCategory);
          
          if (result) {
            setCurrentCollection(result.collection);
            setAllProducts(result.products);
            setProducts(result.products);
            // Set the selected category
            setSelectedCategory(result.collection.title);
          }
        } else {
          // Fetch all products
          const { products } = await fetchProducts();
          
          if (!products || products.length === 0) {
            console.warn('No products received from Shopify');
            return;
          }
          
          setCurrentCollection(null);
          setAllProducts(products);
          setProducts(products);
          setSelectedCategory("All");
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadProducts();
  }, [urlCategory]);

  // Filter and sort products
  useEffect(() => {
    if (loading) return;

    let filteredProducts = [...allProducts];

    // Filter by category (only when not using URL category)
    if (!urlCategory && selectedCategory !== "All") {
      filteredProducts = filteredProducts.filter(
        product => product.productType === selectedCategory
      );
    }

    // Filter by price range
    filteredProducts = filteredProducts.filter(
      product => {
        const price = parseFloat(product.price);
        return price >= priceRange[0] && price <= priceRange[1];
      }
    );

    // Sort products
    switch (sortOption) {
      case "price-low":
        filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-high":
        filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "newest":
        filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    setProducts(filteredProducts);
  }, [selectedCategory, sortOption, priceRange, loading, allProducts, urlCategory]);

  // Update price range when products load
  useEffect(() => {
    if (allProducts.length > 0) {
      const prices = allProducts.map(p => parseFloat(p.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    }
  }, [allProducts]);

  const handlePriceRangeChange = (index, value) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = parseInt(value);
    setPriceRange(newPriceRange);
  };

  const CategoryButton = ({ category }) => {
    const isActive = urlCategory 
      ? (currentCollection?.title.toLowerCase() === category.label.toLowerCase())
      : (selectedCategory === category.label);
    
    return (
      <a
        href={category.href}
        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
          isActive
            ? 'bg-gradient-to-r from-[#FFE8D6] to-[#F8E1C8] text-[#1e3d2f] font-medium'
            : 'text-[#3e554a] hover:bg-white/50'
        }`}
      >
        {category.label}
      </a>
    );
  };

  const HeroSection = () => (
    <div className="relative bg-gradient-to-r from-[#FF8A5B]/20 to-[#4ECDC4]/20 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1e3d2f] mb-4"
        >
          {currentCollection ? currentCollection.title : 'Western Palms Shop'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-[#3e554a] max-w-3xl mx-auto"
        >
          {currentCollection 
            ? `Explore our ${currentCollection.title.toLowerCase()} collection`
            : 'Discover our handcrafted collections inspired by the beauty of the Southwest'}
        </motion.p>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50 min-h-screen">
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 sticky top-4">
              <h3 className="font-bold text-lg text-[#1e3d2f] mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-[#1e3d2f] mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <CategoryButton key={category.label} category={category} />
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-[#1e3d2f] mb-3">Price Range (₹)</h4>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm text-[#3e554a] mb-1">Min</label>
                      <input
                        type="number"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                        className="w-full px-3 py-2 border border-[#d1d9d5] rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-[#3e554a] mb-1">Max</label>
                      <input
                        type="number"
                        min={priceRange[0]}
                        max="4000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                        className="w-full px-3 py-2 border border-[#d1d9d5] rounded-md"
                      />
                    </div>
                  </div>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="4000"
                      step="100"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                      className="w-full h-2 bg-[#d1d9d5] rounded-lg appearance-none cursor-pointer mb-4"
                    />
                    <input
                      type="range"
                      min="0"
                      max="4000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                      className="w-full h-2 bg-[#d1d9d5] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filters Button */}
            <div className="md:hidden flex justify-between items-center mb-6">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-lg shadow-md border border-white/20"
              >
                <svg className="w-5 h-5 text-[#1e3d2f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>

              {/* Sort Options */}
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-white/80 backdrop-blur-md pl-3 pr-8 py-2 rounded-lg shadow-md border border-white/20 text-[#1e3d2f] focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#1e3d2f]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Products Count and Sort - Desktop */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <p className="text-[#3e554a]">
                Showing {products.length} {products.length === 1 ? "product" : "products"}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-[#3e554a]">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white/80 backdrop-blur-md pl-3 pr-8 py-2 rounded-lg shadow-md border border-white/20 text-[#1e3d2f] focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileFiltersOpen(false)}
              />

              {/* Filters Panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30 }}
                className="relative bg-white w-full max-w-xs flex-1 flex flex-col"
              >
                <div className="flex items-center justify-between px-4 py-4 border-b border-[#d1d9d5]">
                  <h2 className="text-lg font-bold text-[#1e3d2f]">Filters</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1 rounded-md hover:bg-[#FFE8D6] transition-colors"
                  >
                    <svg className="w-6 h-6 text-[#1e3d2f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {/* Category Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-[#1e3d2f] mb-3">Category</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <a
                          key={category.label}
                          href={category.href}
                          onClick={() => setMobileFiltersOpen(false)}
                          className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                            (urlCategory ? (currentCollection?.title.toLowerCase() === category.label.toLowerCase()) : (selectedCategory === category.label))
                              ? 'bg-gradient-to-r from-[#FFE8D6] to-[#F8E1C8] text-[#1e3d2f] font-medium'
                              : 'text-[#3e554a] hover:bg-white/50'
                          }`}
                        >
                          {category.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-[#1e3d2f] mb-3">Price Range (₹)</h4>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-sm text-[#3e554a] mb-1">Min</label>
                          <input
                            type="number"
                            min="0"
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                            className="w-full px-3 py-2 border border-[#d1d9d5] rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm text-[#3e554a] mb-1">Max</label>
                          <input
                            type="number"
                            min={priceRange[0]}
                            max="4000"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                            className="w-full px-3 py-2 border border-[#d1d9d5] rounded-md"
                          />
                        </div>
                      </div>
                      <div className="px-2">
                        <input
                          type="range"
                          min="0"
                          max="4000"
                          step="100"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                          className="w-full h-2 bg-[#d1d9d5] rounded-lg appearance-none cursor-pointer mb-4"
                        />
                        <input
                          type="range"
                          min="0"
                          max="4000"
                          step="100"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                          className="w-full h-2 bg-[#d1d9d5] rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-[#d1d9d5]">
                  <a
                    href="/shop"
                    className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8A5B] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-center block"
                  >
                    Reset All Filters
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}