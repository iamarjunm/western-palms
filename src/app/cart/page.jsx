// components/CartPage.jsx
"use client";

import { useState, useEffect, useCallback } from "react"; // Added useCallback
import Link from "next/link";
import { ShoppingBag, X, ArrowLeft, Minus, Plus } from 'lucide-react';
import { useCart } from "@/context/CartContext";
import formatCurrency from "@/lib/formatCurrency";
import Image from 'next/image';
import { fetchProductById } from "@/lib/fetchProducts"; // Assuming this is your API utility

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [loadingStock, setLoadingStock] = useState(true);
  // State to hold fetched stock for each variant (variantId -> stock)
  const [variantStocks, setVariantStocks] = useState({});
  const [hasError, setHasError] = useState(false); // To indicate if any fetch failed

  // Calculate totals (these still depend on cart quantities, but stock is fetched separately)
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  // Function to fetch stock for a single item
  const fetchItemStock = useCallback(async (productId, variantId) => {
    try {
      const productData = await fetchProductById(productId);
      if (productData && productData.variants) {
        const variant = productData.variants.find(v => v.id === variantId);
        if (variant) {
          return variant.inventoryQuantity;
        }
      }
      return 0; // Return 0 if variant or product not found
    } catch (error) {
      console.error(`Error fetching stock for product ${productId}, variant ${variantId}:`, error);
      setHasError(true);
      return 0; // Return 0 on error to prevent over-adding
    }
  }, []);

  // Effect to fetch stock for all cart items on component mount or cart changes
  useEffect(() => {
    const getStocks = async () => {
      setLoadingStock(true);
      setHasError(false);
      const newVariantStocks = {};
      const fetchPromises = cart.map(async (item) => {
        const stock = await fetchItemStock(item.id, item.variantId); // Use item.id (product ID) and item.variantId
        newVariantStocks[item.variantId] = stock;
      });

      await Promise.all(fetchPromises);
      setVariantStocks(newVariantStocks);
      setLoadingStock(false);
    };

    if (cart.length > 0) {
      getStocks();
    } else {
      setVariantStocks({}); // Clear stocks if cart is empty
      setLoadingStock(false);
    }
  }, [cart, fetchItemStock]); // Re-run if cart changes or fetchItemStock changes (due to useCallback)

  const handleQuantityChange = (variantId, currentQuantity, type) => {
    const actualStock = variantStocks[variantId] !== undefined ? variantStocks[variantId] : 0; // Use fetched stock

    let newQuantity = currentQuantity;
    if (type === 'increment') {
      newQuantity = currentQuantity + 1;
    } else if (type === 'decrement') {
      newQuantity = currentQuantity - 1;
    }

    // Pass the new quantity and the actual stock to the updateQuantity function in context
    // The updateQuantity in context will handle clamping based on this stock
    updateQuantity(variantId, newQuantity, actualStock); // Pass actualStock
  };


  if (loadingStock) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <p className="text-red-600 font-medium text-lg">
          There was an error loading product stock. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6]/20 to-[#F8E1C8]/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div>
          <Link href="/shop" className="flex items-center text-[#1e3d2f] hover:text-[#3e554a] mb-6">
            <ArrowLeft className="mr-2" size={18} />
            Continue Shopping
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-[#1e3d2f] mb-8">Your Cart</h1>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="mx-auto text-[#3e554a] mb-4" />
              <h2 className="text-2xl font-medium text-[#1e3d2f] mb-2">Your cart is empty</h2>
              <p className="text-[#3e554a] mb-6">Start adding some products to see them here</p>
              <Link
                href="/shop"
                className="inline-block bg-[#1e3d2f] text-white px-6 py-3 rounded-md font-medium hover:bg-[#3e554a] transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-[#d1d9d5] overflow-hidden">
                  {cart.map((item) => {
                    const currentStock = variantStocks[item.variantId]; // Get the fetched stock for this item
                    const isAvailable = currentStock !== undefined && currentStock > 0;
                    const isLowStock = isAvailable && currentStock <= 5;
                    const isOutOfStock = currentStock === 0;

                    return (
                      <div
                        key={item.variantId}
                        className="border-b border-[#d1d9d5] last:border-b-0"
                      >
                        <div className="p-4 sm:p-6 flex">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                            <Image
                              src={item.image || '/placeholder-product.jpg'}
                              alt={item.title}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="ml-4 sm:ml-6 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-[#1e3d2f]">{item.title}</h3>
                                {item.variantTitle && item.variantTitle !== 'Default Title' && (
                                  <p className="text-sm text-[#3e554a] mt-1">{item.variantTitle}</p>
                                )}
                                {/* Stock indicator based on fetched stock */}
                                {isLowStock && (
                                  <p className="text-xs text-yellow-600 mt-1">
                                    Only {currentStock} left in stock!
                                  </p>
                                )}
                                {isOutOfStock && (
                                  <p className="text-xs text-red-600 mt-1">
                                    Out of stock for this variant.
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => removeFromCart(item.variantId)}
                                className="text-[#3e554a] hover:text-[#1e3d2f]"
                              >
                                <X size={18} />
                              </button>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <p className="text-lg font-medium text-[#1e3d2f]">
                                {formatCurrency(item.price * item.quantity)}
                              </p>

                              {/* Quantity Selector */}
                              <div className="flex items-center gap-2 border border-gray-300 rounded-md p-1">
                                <button
                                  onClick={() => handleQuantityChange(item.variantId, item.quantity, 'decrement')}
                                  disabled={item.quantity <= 1 || !isAvailable} // Disable if quantity is 1 or not available
                                  className="p-1 text-gray-600 hover:text-black transition-colors rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item.variantId, item.quantity, 'increment')}
                                  disabled={item.quantity >= currentStock || !isAvailable} // Disable if at max stock or not available
                                  className="p-1 text-gray-600 hover:text-black transition-colors rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-xl shadow-sm border border-[#d1d9d5] p-6 sticky top-6">
                  <h2 className="text-xl font-bold text-[#1e3d2f] mb-6">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-[#3e554a]">Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#3e554a]">Shipping</span>
                      <span className="font-medium">FREE</span>
                    </div>

                    <div className="border-t border-[#d1d9d5] pt-4 flex justify-between">
                      <span className="font-bold text-[#1e3d2f]">Total</span>
                      <span className="font-bold text-[#1e3d2f]">
                        {formatCurrency(total)}
                      </span>
                    </div>

                    <div className="pt-4">
                      <Link
                        href="/checkout"
                        // Disable checkout if any item is out of stock or quantity exceeds stock
                        className={`block w-full text-center py-3 rounded-md font-medium transition-colors ${
                          cart.some(item => (variantStocks[item.variantId] !== undefined && item.quantity > variantStocks[item.variantId]) || (variantStocks[item.variantId] === 0))
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-[#1e3d2f] text-white hover:bg-[#3e554a]"
                        }`}
                        onClick={(e) => {
                          if (cart.some(item => (variantStocks[item.variantId] !== undefined && item.quantity > variantStocks[item.variantId]) || (variantStocks[item.variantId] === 0))) {
                            e.preventDefault();
                            alert("Please adjust quantities for out-of-stock or exceeding-stock items before proceeding.");
                          }
                        }}
                      >
                        Proceed to Checkout
                      </Link>
                    </div>

                    <p className="text-sm text-center text-[#3e554a] mt-4">
                      or{' '}
                      <Link href="/shop" className="text-[#1e3d2f] hover:underline">
                        continue shopping
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}