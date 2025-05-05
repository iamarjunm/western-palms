"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShare2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import ProductGrid from "@/components/ProductGrid"; // Using your existing ProductGrid component
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { fetchProductById, fetchProducts } from "@/lib/fetchProducts";
import formatCurrency from "@/lib/formatCurrency";
import Image from "next/image";

// Color mapping for visual swatches
const colorMap = {
  red: '#ff0000',
  blue: '#0000ff',
  green: '#00ff00',
  black: '#000000',
  white: '#ffffff',
  yellow: '#ffff00',
  pink: '#ffc0cb',
  purple: '#800080',
  orange: '#ffa500',
  gray: '#808080',
};

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [zoomActive, setZoomActive] = useState(false);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        
        if (!data) throw new Error("Product not found");

        setProduct(data);
        
        const defaultVariant = data.variants.find(v => v.available) || data.variants[0];
        setSelectedVariant(defaultVariant);
        
        if (defaultVariant && defaultVariant.options) {
          const initialOptions = {};
          data.options.forEach(option => {
            const optionValue = defaultVariant.options[option.name.toLowerCase()];
            if (optionValue) {
              initialOptions[option.name.toLowerCase()] = optionValue;
            }
          });
          setSelectedOptions(initialOptions);
        }
        
        const allProducts = await fetchProducts();
        const randomProducts = allProducts.products
          .filter(p => p.id !== data.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setRecommendedProducts(randomProducts);

        setIsWishlisted(isInWishlist(data.id));
      } catch (err) {
        console.error("Error loading product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id, isInWishlist]);

  useEffect(() => {
    if (!product || !product.variants) return;

    const newVariant = product.variants.find(variant => {
      return product.options.every(option => {
        const optionName = option.name.toLowerCase();
        return variant.options[optionName] === selectedOptions[optionName];
      });
    });

    if (newVariant) {
      setSelectedVariant(newVariant);
    }
  }, [selectedOptions, product]);

  const handleOptionSelect = (optionName, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName.toLowerCase()]: value
    }));
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      price: selectedVariant.price,
      image: product.images[0]?.url || product.featuredImage?.url || '',
      variantTitle: selectedVariant.title,
      quantity: quantity
    });
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    window.location.href = `${process.env.NEXT_PUBLIC_STORE_URL}/cart/${selectedVariant.id}:${quantity}`;
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: selectedVariant?.price || product.price,
        image: product.images[0]?.url || product.featuredImage?.url || '',
        handle: product.handle
      });
    }
    setIsWishlisted(!isWishlisted);
  };

  const getColorValue = (colorName) => {
    const lowerColor = colorName.toLowerCase();
    return colorMap[lowerColor] || '#cccccc';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Product Not Found</h2>
        <p className="text-gray-600 mb-6 max-w-md">{error || "The product you're looking for doesn't exist."}</p>
        <a 
          href="/shop" 
          className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all shadow-md"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2"
          >
            <FiShoppingBag className="text-lg" />
            <span className="font-medium">Added to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-12">
        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            {/* Main Image with Zoom */}
            <div 
              className={`relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg cursor-${zoomActive ? 'zoom-out' : 'zoom-in'}`}
              onClick={() => setZoomActive(!zoomActive)}
            >
              <Image
                src={product.images[selectedImage]?.url || '/placeholder-product.jpg'}
                alt={product.title}
                width={600}  // Optimized size
                height={600}  // Optimized size
                className={`object-contain w-full h-full transition-transform duration-300 ${zoomActive ? 'scale-150' : 'scale-100'}`}
                priority
                quality={85}  // Reduced quality for better performance
              />
              
              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist();
                }}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all shadow-md ${
                  isWishlisted 
                    ? "bg-pink-500 text-white" 
                    : "bg-white/90 text-gray-900 hover:bg-white"
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FiHeart className={`text-xl ${isWishlisted ? "fill-current" : ""}`} />
              </button>

              {/* Sale Badge */}
              {product.compareAtPrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                  SALE
                </div>
              )}
            </div>

            {/* Thumbnail Grid */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-black shadow-md"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img.url || '/placeholder-product.jpg'}
                      alt={`${product.title} - ${index + 1}`}
                      width={150}  // Smaller thumbnails
                      height={150}  // Smaller thumbnails
                      className="w-full h-full object-contain"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-sm text-gray-500 uppercase tracking-wider">
                {product.productType}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 text-gray-900">
              {product.title}
            </h1>
            
            {/* Price Display */}
            <div className="flex items-center gap-4 mb-6">
              {product.compareAtPrice ? (
                <>
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                  <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
                    Save {product.discountPercentage}%
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            
            {/* Description */}
            {product.description && (
              <div
                className="prose text-gray-700 mb-8 max-w-full"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
            
            {/* Variant Selector */}
            {product.options?.length > 0 && (
              <div className="mb-8 space-y-6">
                {product.options.map(option => {
                  const optionName = option.name.toLowerCase();
                  return (
                    <div key={option.name}>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">
                        {option.name}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {option.values.map(value => {
                          const isSelected = selectedOptions[optionName] === value;
                          const isAvailable = product.variants.some(v => 
                            v.options[optionName] === value && 
                            v.available
                          );
                          
                          const isColorOption = optionName.includes('color');
                          const colorValue = isColorOption ? getColorValue(value) : null;
                          
                          return (
                            <motion.button
                              key={value}
                              onClick={() => handleOptionSelect(option.name, value)}
                              disabled={!isAvailable}
                              whileHover={{ scale: isAvailable ? 1.05 : 1 }}
                              whileTap={{ scale: isAvailable ? 0.95 : 1 }}
                              className={`flex items-center justify-center rounded-full transition-all ${
                                isSelected
                                  ? isColorOption
                                    ? "ring-2 ring-offset-2 ring-black"
                                    : "bg-black text-white"
                                  : isAvailable
                                    ? isColorOption 
                                      ? "hover:ring-1 hover:ring-gray-300"
                                      : "border border-gray-300 hover:border-black"
                                    : "opacity-50 cursor-not-allowed"
                              }`}
                              style={
                                isColorOption 
                                  ? { 
                                      backgroundColor: colorValue,
                                      width: '40px',
                                      height: '40px',
                                      ...(isSelected ? { border: '2px solid white', boxShadow: '0 0 0 2px black' } : {})
                                    }
                                  : {
                                      padding: '0.5rem 1rem',
                                      minWidth: '40px'
                                    }
                              }
                              title={value}
                            >
                              {!isColorOption && (
                                <span className={`text-sm font-medium ${
                                  isSelected ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {value}
                                </span>
                              )}
                              {!isAvailable && (
                                <span className="sr-only">(Sold out)</span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Quantity</h3>
              <div className="flex items-center gap-4 w-fit border border-gray-300 rounded-lg p-1 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-600 hover:text-black transition-colors rounded-full hover:bg-gray-100"
                >
                  <FiMinus />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-600 hover:text-black transition-colors rounded-full hover:bg-gray-100"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <motion.button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.available}
                whileHover={selectedVariant?.available ? { scale: 1.02 } : {}}
                whileTap={selectedVariant?.available ? { scale: 0.98 } : {}}
                className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  selectedVariant?.available
                    ? "bg-black text-white hover:bg-gray-900 shadow-lg"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FiShoppingBag />
                {selectedVariant?.available ? "Add to Cart" : "Sold Out"}
              </motion.button>
              <motion.button
                onClick={handleBuyNow}
                disabled={!selectedVariant?.available}
                whileHover={selectedVariant?.available ? { scale: 1.02 } : {}}
                whileTap={selectedVariant?.available ? { scale: 0.98 } : {}}
                className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                  selectedVariant?.available
                    ? "bg-white text-black border-2 border-black hover:bg-gray-50 shadow-lg"
                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                }`}
              >
                Buy Now
              </motion.button>
            </div>
            
            {/* Share Button */}
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors w-fit px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <FiShare2 />
              <span className="text-sm font-medium">Share this product</span>
            </button>
          </div>
        </div>

        {/* Recommended Products - Using your ProductGrid */}
        {recommendedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-bold mb-8 text-gray-900">You May Also Like</h2>
            <ProductGrid 
              products={recommendedProducts}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            />
            
            <div className="mt-8 text-center">
              <a 
                href="/shop" 
                className="inline-flex items-center gap-2 px-6 py-3 text-black font-medium hover:bg-gray-100 rounded-lg transition-all"
              >
                View All Products <FiArrowRight />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}