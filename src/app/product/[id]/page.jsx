"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShare2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import ProductGrid from "@/components/ProductGrid";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { fetchProductById, fetchProducts } from "@/lib/fetchProducts";
import formatCurrency from "@/lib/formatCurrency";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const [selectedImage, setSelectedImage] = useState(0); // Index of the currently displayed image
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [zoomActive, setZoomActive] = useState(false);
  const router = useRouter();

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Function to determine if a specific option value is available given current selections
  const isOptionValueAvailable = useCallback((optionName, value) => {
    if (!product || !product.variants) return false;

    // Create a potential set of options if this value were selected
    const potentialOptions = {
      ...selectedOptions,
      [optionName.toLowerCase()]: value
    };

    // Check if any variant exists that matches all of these potential options AND is available
    return product.variants.some(variant => {
      const matchesAllOptions = Object.entries(potentialOptions).every(([key, val]) => {
        return variant.options[key] === val;
      });
      return matchesAllOptions && variant.available;
    });
  }, [product, selectedOptions]);

  // Effect to load product data and set initial states
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);

        if (!data) throw new Error("Product not found");

        setProduct(data);

        // Find a default variant: prioritize available, then first one
        let defaultVariant = data.variants.find(v => v.available);
        if (!defaultVariant && data.variants.length > 0) {
          defaultVariant = data.variants[0];
        }
        setSelectedVariant(defaultVariant);

        // Initialize selected options based on the default variant
        const initialOptions = {};
        if (defaultVariant && defaultVariant.options) {
          data.options.forEach(option => {
            const optionValue = defaultVariant.options[option.name.toLowerCase()];
            if (optionValue) {
              initialOptions[option.name.toLowerCase()] = optionValue;
            }
          });
        }
        setSelectedOptions(initialOptions);

        // --- DEBUG: Initial Load Image Logic ---
        console.log("--- Initial Product Load ---");
        console.log("Product Data:", data);
        console.log("Default Variant:", defaultVariant);
        console.log("Product Images:", data.images.map(img => img.url));

        // Set initial main image based on default variant's image or first product image
        if (defaultVariant && defaultVariant.image) {
          console.log("Default Variant Image URL:", defaultVariant.image.url);
          const defaultImageIndex = data.images.findIndex(img => img.url === defaultVariant.image.url);
          if (defaultImageIndex !== -1) {
            console.log("Found default variant image in product images at index:", defaultImageIndex);
            setSelectedImage(defaultImageIndex);
          } else {
            console.warn("Default variant image not found in product.images. Falling back to first image.");
            setSelectedImage(0);
          }
        } else if (data.images.length > 0) {
          console.log("No default variant image or default variant, using first product image.");
          setSelectedImage(0);
        }
        console.log("Initial selectedImage index set to:", selectedImage);
        // --- END DEBUG ---


        // Fetch and set recommended products
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

  // Effect to update selectedVariant and main image when selectedOptions change
  useEffect(() => {
    if (!product || !product.variants) return;

    // --- DEBUG: Option Change Logic ---
    console.log("\n--- selectedOptions Changed ---");
    console.log("Current selectedOptions:", selectedOptions);
    console.log("Product options:", product.options.map(o => o.name.toLowerCase()));
    console.log("All product variants:", product.variants.map(v => ({ id: v.id, title: v.title, options: v.options, image: v.image?.url })));


    // Find the variant that matches all currently selected options
    const newVariant = product.variants.find(variant => {
      return product.options.every(option => {
        const optionName = option.name.toLowerCase();
        // Check if the variant's option matches the selected option
        // IMPORTANT: Ensure variant.options[optionName] exists before comparing
        return variant.options.hasOwnProperty(optionName) && variant.options[optionName] === selectedOptions[optionName];
      });
    });

    console.log("Found newVariant:", newVariant ? { id: newVariant.id, title: newVariant.title, image: newVariant.image?.url } : null);

    setSelectedVariant(newVariant || null); // Ensure it's null if no exact match

    // Logic to update the main displayed image based on the selected variant
    if (newVariant && newVariant.image) {
      console.log("New Variant has an image:", newVariant.image.url);
      const imageIndex = product.images.findIndex(img => img.url === newVariant.image.url);
      console.log("Attempting to find variant image in product.images. Index found:", imageIndex);

      if (imageIndex !== -1) {
        setSelectedImage(imageIndex);
        console.log("Main image set to variant image at index:", imageIndex);
      } else {
        console.warn(`Variant image for ${newVariant.title} not found in main product images. Falling back to first image.`);
        setSelectedImage(0); // Fallback to first image
      }
    } else if (product.images.length > 0) {
      console.log("No new variant or new variant has no specific image. Falling back to first product image.");
      setSelectedImage(0);
    } else {
      console.log("No images available for product.");
      setSelectedImage(0); // Ensure a default even if no images
    }
    console.log("Current selectedImage index after option change:", selectedImage);
    // --- END DEBUG ---
  }, [selectedOptions, product]); // Re-run when selected options or product data changes

  // Handles selection of product options (e.g., Size, Color)
  const handleOptionSelect = (optionName, value) => {
    const lowerCaseOptionName = optionName.toLowerCase();
    console.log(`\n--- handleOptionSelect: ${optionName}: ${value} ---`);
    setSelectedOptions(prev => {
      const newOptions = { ...prev };
      newOptions[lowerCaseOptionName] = value;

      // Logic to ensure other selected options are still valid after this selection
      product.options.forEach(opt => {
        const currentOptName = opt.name.toLowerCase();
        if (currentOptName === lowerCaseOptionName) return; // Skip the option just selected

        const currentOptValue = newOptions[currentOptName];
        if (currentOptValue) {
          const isStillAvailable = product.variants.some(v => {
            const tempOptions = { ...newOptions, [currentOptName]: currentOptValue };
            const matches = Object.entries(tempOptions).every(([key, val]) => {
              return v.options.hasOwnProperty(key) && v.options[key] === val;
            });
            return matches && v.available;
          });

          if (!isStillAvailable) {
            console.log(`Deselecting ${currentOptName}: ${currentOptValue} because it's no longer available.`);
            delete newOptions[currentOptName]; // Deselect if no longer available
          }
        }
      });
      console.log("New selectedOptions after handleOptionSelect:", newOptions);
      return newOptions; // The useEffect will react to this change
    });
  };


  const handleAddToCart = () => {
    if (!selectedVariant || !selectedVariant.available) {
      console.warn("Attempted to add to cart without selected variant or if not available.");
      return;
    }

    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      price: selectedVariant.price,
      // IMPORTANT: Use selectedVariant.image.url for cart image if available, otherwise product.images[selectedImage]?.url
      image: selectedVariant.image?.url || product.images[selectedImage]?.url || product.featuredImage?.url || '',
      variantTitle: selectedVariant.title,
      quantity: quantity,
      stock: selectedVariant.inventoryQuantity
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
    console.log("Added to cart:", { selectedVariant, quantity });
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || !selectedVariant.available) {
      alert("Please select available options before proceeding.");
      return;
    }

    try {
      addToCart({
        id: product.id,
        variantId: selectedVariant.id,
        title: product.title,
        price: selectedVariant.price,
        // IMPORTANT: Use selectedVariant.image.url for cart image if available, otherwise product.images[selectedImage]?.url
        image: selectedVariant.image?.url || product.images[selectedImage]?.url || product.featuredImage?.url || '',
        variantTitle: selectedVariant.title,
        quantity: quantity,
        stock: selectedVariant.inventoryQuantity
      });
      router.push('/checkout');
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to proceed to checkout. Please try again.");
    }
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      console.log("Removed from wishlist:", product.id);
    } else {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: selectedVariant?.price || product.price,
        image: product.images[0]?.url || product.featuredImage?.url || '', // Wishlist usually uses main product image
        handle: product.handle
      });
      console.log("Added to wishlist:", product.id);
    }
    setIsWishlisted(!isWishlisted);
  };

  const getColorValue = (colorName) => {
    const lowerColor = colorName.toLowerCase();
    return colorMap[lowerColor] || '#cccccc';
  };

  // Helper to get available values for a given option name
  const getAvailableOptionValues = useCallback((optionName) => {
    if (!product || !product.variants) return [];

    const availableValues = new Set();
    product.variants.forEach(variant => {
      const optionValue = variant.options[optionName.toLowerCase()];
      if (optionValue) {
        // Create a temporary set of selected options for checking availability
        const tempSelectedOptions = { ...selectedOptions };
        // Temporarily set the current option to the variant's value
        tempSelectedOptions[optionName.toLowerCase()] = optionValue;

        // Check if this variant, with its current option value, is available
        // when combined with ALL other currently selected options.
        const matchesOtherSelectedOptions = Object.entries(tempSelectedOptions).every(([key, val]) => {
          // If this is the current option being evaluated, we've already set it.
          // Otherwise, check if it matches the existing selected option.
          return variant.options.hasOwnProperty(key) && variant.options[key] === val;
        });

        if (matchesOtherSelectedOptions && variant.available) {
          availableValues.add(optionValue);
        }
      }
    });

    // Sort sizes specifically
    if (optionName.toLowerCase() === 'size') {
      const sizeOrder = { 'XS': 0, 'S': 1, 'M': 2, 'L': 3, 'XL': 4, 'XXL': 5 };
      return Array.from(availableValues).sort((a, b) => (sizeOrder[a] || 99) - (sizeOrder[b] || 99));
    }
    return Array.from(availableValues);
  }, [product, selectedOptions]);


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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div
              className={`relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg cursor-${zoomActive ? 'zoom-out' : 'zoom-in'}`}
              onClick={() => setZoomActive(!zoomActive)}
            >
              <Image
                // Use selectedImage to determine the displayed image
                src={product.images[selectedImage]?.url || '/placeholder-product.jpg'}
                alt={product.title}
                width={600}
                height={600}
                className={`object-contain w-full h-full transition-transform duration-300 ${zoomActive ? 'scale-150' : 'scale-100'}`}
                priority
                quality={85}
              />

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

              {product.compareAtPrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                  SALE
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)} // This allows manual selection of thumbnails
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
                      width={150}
                      height={150}
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

            <div className="flex items-center gap-4 mb-6">
              {product.compareAtPrice ? (
                <>
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(selectedVariant?.price || product.price)}
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
                  {formatCurrency(selectedVariant?.price || product.price)}
                </span>
              )}
            </div>

            {product.descriptionHtml && ( // Changed from description to descriptionHtml for better rendering
              <div
                className="prose text-gray-700 mb-8 max-w-full"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            )}

            {/* Option Selectors */}
            {product.options && product.options.length > 0 && (
              <div className="mb-8 space-y-6">
                {product.options.map(option => {
                  const optionName = option.name.toLowerCase();
                  const availableValues = getAvailableOptionValues(optionName); // Get available values for this option

                  return (
                    <div key={option.name}>
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">
                        {option.name}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {option.values.map(value => {
                          const isSelected = selectedOptions[optionName] === value;
                          const isAvailable = availableValues.includes(value); // Determine availability here
                          const isColorOption = optionName.includes('color'); // Case-insensitive check
                          const colorValue = isColorOption ? getColorValue(value) : null;

                          let stockIndicator = null;
                          if (optionName === 'size' && isAvailable) {
                            // Find the specific variant that would result from this size selection combined with other selected options
                            const variantForSize = product.variants.find(v =>
                              Object.entries({ ...selectedOptions, [optionName]: value }).every(([k, v_val]) =>
                                v.options.hasOwnProperty(k) && v.options[k] === v_val
                              )
                            );

                            if (variantForSize) {
                              if (variantForSize.available && variantForSize.inventoryQuantity > 0 && variantForSize.inventoryQuantity <= 5) {
                                stockIndicator = (
                                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {variantForSize.inventoryQuantity}
                                  </span>
                                );
                              } else if (!variantForSize.available || variantForSize.inventoryQuantity === 0) {
                                stockIndicator = (
                                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    X
                                  </span>
                                );
                              }
                            }
                          } else if (!isAvailable) {
                            stockIndicator = (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                X
                              </span>
                            );
                          }


                          return (
                            <motion.button
                              key={value}
                              onClick={() => handleOptionSelect(option.name, value)}
                              disabled={!isAvailable}
                              whileHover={{ scale: isAvailable ? 1.05 : 1 }}
                              whileTap={{ scale: isAvailable ? 0.95 : 1 }}
                              className={`flex items-center justify-center rounded-full transition-all relative ${
                                isAvailable ? '' : 'opacity-50 cursor-not-allowed'
                              } ${
                                isColorOption
                                  ? `border-2 ${isSelected ? 'border-black' : 'border-transparent'} ${isAvailable ? 'hover:ring-1 hover:ring-gray-300' : ''}`
                                  : `py-2 px-4 border ${isSelected ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-300 hover:border-black'}`
                              }`}
                              style={
                                isColorOption
                                  ? {
                                      backgroundColor: colorValue,
                                      width: '40px',
                                      height: '40px',
                                      outline: isSelected ? '2px solid white' : 'none',
                                      outlineOffset: isSelected ? '2px' : '0px',
                                      boxShadow: isSelected ? '0 0 0 4px black' : 'none'
                                    }
                                  : {}
                              }
                              title={value}
                            >
                              {!isColorOption && (
                                <span className={`text-sm font-medium`}>
                                  {value}
                                </span>
                              )}
                              {stockIndicator}
                            </motion.button>
                          );
                        })}
                      </div>
                      {optionName === 'size' && (
                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-4">
                          {product.variants.some(v => v.options.size && v.available && v.inventoryQuantity > 0 && v.inventoryQuantity <= 5 && availableValues.includes(v.options.size)) && (
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                              Low stock
                            </span>
                          )}
                          {product.variants.some(v => v.options.size && (!v.available || v.inventoryQuantity === 0) && availableValues.includes(v.options.size)) && (
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                              Out of stock
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

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

            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors w-fit px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <FiShare2 />
              <span className="text-sm font-medium">Share this product</span>
            </button>
          </div>
        </div>

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