"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import { 
  FiHeart, 
  FiShoppingBag, 
  FiEye, 
  FiChevronRight, 
  FiX, 
  FiMinus, 
  FiPlus 
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import formatCurrency from "@/lib/formatCurrency";
import { ErrorBoundary } from "react-error-boundary";

function ProductErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="relative group rounded-xl bg-gray-100 aspect-square">
      <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
        <p>Product display error</p>
        <button 
          onClick={resetErrorBoundary}
          className="mt-2 text-sm text-blue-500 hover:underline"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  // Add ID extraction function
  const extractId = (id) => {
    if (typeof id === 'string') {
      const parts = id.split('/');
      return parts[parts.length - 1];
    }
    return id;
  };

  const productId = extractId(product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Check if mobile on mount
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Process variants to separate colors and sizes
  const { colorVariants, sizeVariants, allVariants, defaultVariant } = useMemo(() => {
    const variants = product.variants?.edges 
      ? product.variants.edges.map(edge => edge.node) 
      : product.variants || [];

    const colorMap = new Map();
    const sizeMap = new Map();

    variants.forEach(variant => {
      variant.selectedOptions?.forEach(option => {
        if (option.name.toLowerCase() === 'color') {
          colorMap.set(option.value, {
            value: option.value,
            variantId: variant.id,
            image: variant.image?.url || product.featuredImage?.url
          });
        } else if (option.name.toLowerCase() === 'size') {
          sizeMap.set(option.value, {
            value: option.value,
            variantId: variant.id
          });
        }
      });
    });

    const result = {
      colorVariants: Array.from(colorMap.values()),
      sizeVariants: Array.from(sizeMap.values()),
      allVariants: variants,
      defaultVariant: variants[0] || null
    };

    return result;
  }, [product]);

  const [selectedColor, setSelectedColor] = useState(colorVariants[0]?.value || null);
  const [selectedSize, setSelectedSize] = useState(sizeVariants[0]?.value || null);

  // Find the matching variant based on selected color and size
  const selectedVariant = useMemo(() => {
    if (!selectedColor && !selectedSize) return defaultVariant;
    
    return allVariants.find(variant => {
      const options = variant.selectedOptions || [];
      const hasColor = !selectedColor || options.some(opt => 
        opt.name.toLowerCase() === 'color' && opt.value === selectedColor);
      const hasSize = !selectedSize || options.some(opt => 
        opt.name.toLowerCase() === 'size' && opt.value === selectedSize);
      return hasColor && hasSize;
    }) || defaultVariant;
  }, [selectedColor, selectedSize, allVariants, defaultVariant]);

  // Process images with proper fallbacks
  const images = useMemo(() => {
    console.log('Processing images for product:', product.title);
    
    // First check if we have direct images array
    if (product.images && product.images.length > 0) {
      console.log('Using product.images:', product.images);
      return product.images.map(img => ({
        url: typeof img === 'string' ? img : img.url || img.src,
        isVariantImage: false
      }));
    }

    // Then check for featuredImage
    if (product.featuredImage) {
      console.log('Using featuredImage:', product.featuredImage);
      return [{
        url: typeof product.featuredImage === 'string' 
          ? product.featuredImage 
          : product.featuredImage.url,
        isVariantImage: false
      }];
    }

    // Fallback to placeholder
    console.log('Using placeholder image');
    return [{ url: '/placeholder-product.jpg', isVariantImage: false }];
  }, [product]);

  // Price calculations
  const price = selectedVariant?.price?.amount || 
               product.priceRange?.minVariantPrice?.amount || 
               product.price || 0;
  const compareAtPrice = selectedVariant?.compareAtPrice?.amount || 
                       product.compareAtPriceRange?.minVariantPrice?.amount || 
                       product.compareAtPrice || 0;
  const discountPercentage = compareAtPrice > price 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addToCart({
      id: product.id,
      variantId: selectedVariant.id,
      title: product.title,
      price: price,
      image: images[0]?.url || images[0]?.src,
      variantTitle: selectedVariant.title,
      quantity: quantity
    });
    
    // Trigger cart animation
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
      cartButton.classList.add('animate-ping');
      setTimeout(() => cartButton.classList.remove('animate-ping'), 500);
    }
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
          title: product.title || 'Untitled Product',
          price: product.price || '0',
          compareAtPrice: product.compareAtPrice || '0',
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
        });
      
      const wishlistButton = document.getElementById(`wishlist-${product.id}`);
      if (wishlistButton) {
        wishlistButton.classList.add('animate-pulse');
        setTimeout(() => wishlistButton.classList.remove('animate-pulse'), 500);
      }
    }
  };

  // Auto-rotate images on hover
  useEffect(() => {
    let interval;
    if (isHovered && images.length > 1 && !isMobile) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => 
          prev === images.length - 1 ? 0 : prev + 1
        );
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length, isMobile]);

  // Loading state
  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="relative group rounded-xl bg-gray-100 aspect-[3/4] animate-pulse">
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 self-end"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {product.tags?.includes('new') && (
          <span className="bg-[#FF6B6B] text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            NEW
          </span>
        )}
        {product.tags?.includes('bestseller') && (
          <span className="bg-[#FFBE0B] text-[#5C4200] text-xs font-bold px-2 py-1 rounded-full shadow-md">
            BESTSELLER
          </span>
        )}
        {discountPercentage > 0 && (
          <span className="bg-[#3A86FF] text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            -{discountPercentage}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        id={`wishlist-${product.id}`}
        onClick={toggleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition-all ${
          isWishlisted 
            ? 'bg-[#FF6B6B] text-white' 
            : 'bg-white/90 text-[#1e3d2f] hover:bg-[#FF6B6B] hover:text-white'
        }`}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <FiHeart className={`${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image */}
      <Link href={`/product/${productId}`} className="block overflow-hidden rounded-xl bg-white/50">
        <div className="relative aspect-[3/4] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentImageIndex]?.url || 
                     images[currentImageIndex]?.src || 
                     '/placeholder-product.jpg'}
                alt={product.title || "Product image"}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={currentImageIndex === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Quick View Button - Hidden on mobile */}
          {!isMobile && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10
              }}
              transition={{ duration: 0.3 }}
              onClick={(e) => {
                e.preventDefault();
                setQuickViewOpen(true);
              }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-md text-[#1e3d2f] px-4 py-2 rounded-full font-medium shadow-md hover:bg-white transition-all flex items-center gap-2"
            >
              <FiEye /> Quick View
            </motion.button>
          )}

          {/* Image Navigation Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? 'bg-[#1e3d2f] w-4' 
                      : 'bg-white/80'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="mt-4">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/product/${productId}`}>
              <h3 className="font-bold text-[#1e3d2f] group-hover:text-[#FF6B6B] transition-colors">
                {product.title}
              </h3>
            </Link>
            <p className="text-sm text-[#3e554a]">{product.productType}</p>
          </div>
          
          <div className="text-right">
            {compareAtPrice > 0 ? (
              <>
                <span className="text-[#FF6B6B] font-bold">
                  {formatCurrency(price)}
                </span>
                <span className="block text-xs text-[#3e554a] line-through">
                  {formatCurrency(compareAtPrice)}
                </span>
              </>
            ) : (
              <span className="font-bold text-[#1e3d2f]">
                {formatCurrency(price)}
              </span>
            )}
          </div>
        </div>

        {/* Color Variants */}
        {colorVariants.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {colorVariants.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-6 h-6 rounded-full border-2 transition-all relative ${
                    selectedColor === color.value 
                      ? 'border-[#1e3d2f] ring-1 ring-offset-1 ring-[#1e3d2f]' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  aria-label={`Select color ${color.value}`}
                  title={color.value}
                >
                  {selectedColor === color.value && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hover Actions - Always visible on mobile */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMobile ? 1 : isHovered ? 1 : 0,
            height: isMobile ? 'auto' : isHovered ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant}
              className={`flex items-center justify-center gap-1 bg-[#1e3d2f] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#3e554a] transition-colors flex-1 ${
                !selectedVariant ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FiShoppingBag /> Add to Bag
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick View Modal - Only show on desktop */}
      {!isMobile && (
        <AnimatePresence>
          {quickViewOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25 }}
                className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setQuickViewOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md hover:bg-[#FF6B6B] hover:text-white transition-colors z-10"
                  aria-label="Close quick view"
                >
                  <FiX />
                </button>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Product Images */}
                  <div className="sticky top-0">
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={images[currentImageIndex]?.url || 
                             images[currentImageIndex]?.src || 
                             '/placeholder-product.jpg'}
                        alt={product.title || "Product image"}
                        fill
                        className="object-cover object-center rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                    {images.length > 1 && (
                      <div className="p-4 grid grid-cols-4 gap-2">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`aspect-[3/4] relative rounded-md overflow-hidden border-2 transition-all ${
                              index === currentImageIndex 
                                ? 'border-[#1e3d2f]' 
                                : 'border-transparent'
                            }`}
                          >
                            <Image
                              src={image.url || image.src || '/placeholder-product.jpg'}
                              alt={product.title ? `${product.title} - ${index + 1}` : `Product view ${index + 1}`}
                              fill
                              className="object-cover object-center"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-2">
                      {product.tags?.includes('new') && (
                        <span className="bg-[#FF6B6B] text-white text-xs font-bold px-2 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                      {product.tags?.includes('bestseller') && (
                        <span className="bg-[#FFBE0B] text-[#5C4200] text-xs font-bold px-2 py-1 rounded-full">
                          BESTSELLER
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-[#1e3d2f] mb-2">
                      {product.title}
                    </h2>

                    <div className="flex items-center gap-2 mb-4">
                      {compareAtPrice > 0 ? (
                        <>
                          <span className="text-xl text-[#FF6B6B] font-bold">
                            {formatCurrency(price)}
                          </span>
                          <span className="text-[#3e554a] line-through">
                            {formatCurrency(compareAtPrice)}
                          </span>
                          <span className="text-xs bg-[#FF6B6B]/10 text-[#FF6B6B] px-2 py-1 rounded-full">
                            Save {discountPercentage}%
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-[#1e3d2f]">
                          {formatCurrency(price)}
                        </span>
                      )}
                    </div>

                    <div 
                      className="prose prose-sm text-[#3e554a] mb-6" 
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml || '' }}
                    />

                    {/* Color Variant Selection */}
                    {colorVariants.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-[#1e3d2f] mb-2">Color</h4>
                        <div className="flex flex-wrap gap-2">
                          {colorVariants.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setSelectedColor(color.value)}
                              className={`w-8 h-8 rounded-full border-2 transition-all relative ${
                                selectedColor === color.value 
                                  ? 'border-[#1e3d2f] ring-1 ring-offset-1 ring-[#1e3d2f]' 
                                  : 'border-transparent hover:border-gray-300'
                              }`}
                              style={{ backgroundColor: color.value }}
                              aria-label={`Select color ${color.value}`}
                              title={color.value}
                            >
                              {selectedColor === color.value && (
                                <span className="absolute inset-0 flex items-center justify-center text-white text-xs">
                                  ✓
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Variant Selection */}
                    {sizeVariants.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-[#1e3d2f] mb-2">Size</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {sizeVariants.map((size) => (
                            <button
                              key={size.value}
                              onClick={() => setSelectedSize(size.value)}
                              className={`py-2 border rounded-md transition-all ${
                                selectedSize === size.value 
                                  ? 'border-[#1e3d2f] bg-[#1e3d2f] text-white' 
                                  : 'border-[#d1d9d5] hover:border-[#1e3d2f]'
                              }`}
                            >
                              {size.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="mb-6">
                      <h4 className="font-medium text-[#1e3d2f] mb-2">Quantity</h4>
                      <div className="flex items-center gap-4 w-fit">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 rounded-full border border-[#d1d9d5] hover:bg-[#1e3d2f]/10 transition-colors"
                        >
                          <FiMinus />
                        </button>
                        <span className="text-xl w-8 text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 rounded-full border border-[#d1d9d5] hover:bg-[#1e3d2f]/10 transition-colors"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          handleAddToCart();
                          setQuickViewOpen(false);
                        }}
                        disabled={!selectedVariant}
                        className={`flex-1 bg-[#1e3d2f] text-white py-3 px-6 rounded-md font-medium hover:bg-[#3e554a] transition-colors flex items-center justify-center gap-2 ${
                          !selectedVariant ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <FiShoppingBag /> Add to Bag
                      </button>
                      <button
                        onClick={toggleWishlist}
                        className={`p-3 rounded-md border transition-colors ${
                          isWishlisted 
                            ? 'bg-[#FF6B6B] text-white border-[#FF6B6B]' 
                            : 'border-[#d1d9d5] hover:border-[#FF6B6B] hover:text-[#FF6B6B]'
                        }`}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <FiHeart className={isWishlisted ? 'fill-current' : ''} />
                      </button>
                    </div>

                    <Link
                      href={`/product/${productId}`}
                      className="mt-4 inline-flex items-center text-[#3A86FF] hover:text-[#1e3d2f] transition-colors"
                      onClick={() => setQuickViewOpen(false)}
                    >
                      View full details <FiChevronRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    handle: PropTypes.string,
    productType: PropTypes.string,
    descriptionHtml: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    priceRange: PropTypes.shape({
      minVariantPrice: PropTypes.shape({
        amount: PropTypes.string
      })
    }),
    compareAtPriceRange: PropTypes.shape({
      minVariantPrice: PropTypes.shape({
        amount: PropTypes.string
      })
    }),
    featuredImage: PropTypes.shape({
      url: PropTypes.string
    }),
    media: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        url: PropTypes.string
      })
    ),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        src: PropTypes.string
      })
    ),
    variants: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          price: PropTypes.shape({
            amount: PropTypes.string
          }),
          compareAtPrice: PropTypes.shape({
            amount: PropTypes.string
          }),
          selectedOptions: PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string,
              value: PropTypes.string
            })
          ),
          image: PropTypes.shape({
            url: PropTypes.string
          })
        })
      ),
      PropTypes.shape({
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.shape({
              id: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
              price: PropTypes.shape({
                amount: PropTypes.string
              }),
              compareAtPrice: PropTypes.shape({
                amount: PropTypes.string
              }),
              selectedOptions: PropTypes.arrayOf(
                PropTypes.shape({
                  name: PropTypes.string,
                  value: PropTypes.string
                })
              ),
              image: PropTypes.shape({
                url: PropTypes.string
              })
            })
          })
        )
      })
    ])
  })
};

export default function ProductCardWrapper(props) {
  return (
    <ErrorBoundary FallbackComponent={ProductErrorFallback}>
      <ProductCard {...props} />
    </ErrorBoundary>
  );
}