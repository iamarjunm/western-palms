"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, X, ArrowLeft, Check, XCircle } from 'lucide-react';
import { useCart } from "@/context/CartContext";
import formatCurrency from "@/lib/formatCurrency";
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal

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
                {/* Cart Items List */}
                <div className="bg-white rounded-xl shadow-sm border border-[#d1d9d5] overflow-hidden">
                  {cart.map((item) => (
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
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.variantId)}
                              className="text-[#3e554a] hover:text-[#1e3d2f]"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center border border-[#d1d9d5] rounded-md">
                              <button 
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                className="px-3 py-1 text-[#3e554a] hover:bg-[#FFE8D6]"
                              >
                                -
                              </button>
                              <span className="px-3 py-1">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                className="px-3 py-1 text-[#3e554a] hover:bg-[#FFE8D6]"
                              >
                                +
                              </button>
                            </div>
                            
                            <p className="text-lg font-medium text-[#1e3d2f]">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                        className="block w-full text-center bg-[#1e3d2f] text-white py-3 rounded-md font-medium hover:bg-[#3e554a] transition-colors"
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