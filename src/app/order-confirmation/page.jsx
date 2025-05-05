"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle, Truck, CreditCard, Package } from "lucide-react";
import Link from "next/link";

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#4ECDC4]" />
      <h1 className="text-2xl font-bold text-[#1e3d2f]">Loading your order details</h1>
      <p className="text-[#3e554a]">Please wait while we fetch your order</p>
    </div>
  </div>
);

// Error component
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50 flex items-center justify-center p-4">
    <div className="max-w-md text-center space-y-6">
      <div className="space-y-2">
        <AlertCircle className="h-12 w-12 text-[#FF8A5B] mx-auto" />
        <h1 className="text-2xl font-bold text-[#1e3d2f]">Order Not Found</h1>
        <p className="text-[#3e554a]">{error}</p>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={onRetry}
          className="bg-[#4ECDC4] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#3ab9b0] transition"
        >
          Try Again
        </button>
        <Link 
          href="/" 
          className="bg-[#1e3d2f] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2a4f3f] transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  </div>
);

// Main order content component
const OrderContent = ({ orderDetails }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    try {
      return new Date(dateString).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Date not available";
    }
  };

  const requiresShipping = orderDetails?.shippingMethod && 
                         orderDetails.shippingMethod.toLowerCase() !== "no shipping";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Confirmation Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <CheckCircle className="h-16 w-16 text-[#4ECDC4] mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold mb-3 text-[#1e3d2f]">Order Confirmed!</h1>
          <p className="text-xl text-[#3e554a]">
            Your order #{orderDetails?.orderNumber} has been received
          </p>
        </motion.div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Details Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1e3d2f]">
              <CreditCard className="h-5 w-5" />
              Order Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#3e554a]">Order Number</span>
                <span className="font-mono text-[#1e3d2f]">#{orderDetails?.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3e554a]">Date</span>
                <span className="text-[#1e3d2f]">{formatDate(orderDetails?.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3e554a]">Payment Status</span>
                <span className="capitalize text-[#1e3d2f]">
                  {orderDetails?.paymentStatus?.replace(/_/g, ' ').toLowerCase()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#d1d9d5]">
                <span className="text-[#3e554a]">Total Amount</span>
                <span className="font-bold text-lg text-[#1e3d2f]">₹{orderDetails?.total?.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Shipping/Delivery Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1e3d2f]">
              {requiresShipping ? <Truck className="h-5 w-5" /> : <Package className="h-5 w-5" />}
              {requiresShipping ? "Shipping Info" : "Delivery Info"}
            </h2>
            
            {requiresShipping ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#3e554a]">Method</span>
                  <span className="text-[#1e3d2f]">{orderDetails?.shippingMethod}</span>
                </div>
                
                {orderDetails?.trackingInfo ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[#3e554a]">Tracking Number</span>
                      <a 
                        href={orderDetails.trackingInfo.trackingUrl || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#4ECDC4] hover:underline"
                      >
                        {orderDetails.trackingInfo.trackingId}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#3e554a]">Status</span>
                      <span className="capitalize text-[#1e3d2f]">{orderDetails.trackingInfo.status}</span>
                    </div>
                  </>
                ) : (
                  <div className="py-2 text-[#3e554a]">
                    Your shipping details will be updated soon
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-[#3e554a]">This is a digital order</div>
                <div className="pt-2 text-sm text-[#3e554a]/70">
                  You'll receive access details via email
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Order Items */}
        {orderDetails?.items?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 mb-8"
          >
            <h2 className="text-xl font-bold mb-4 text-[#1e3d2f]">Your Items</h2>
            <div className="divide-y divide-[#d1d9d5]">
              {orderDetails.items.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                  className="py-4 flex items-center"
                >
                  <div className="bg-[#FFE8D6] rounded-md w-16 h-16 flex-shrink-0 mr-4 overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder-product.jpg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#F8E1C8] flex items-center justify-center">
                        <Package className="h-6 w-6 text-[#3e554a]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-[#1e3d2f]">{item.name}</h3>
                    <p className="text-sm text-[#3e554a]">
                      {item.variant && `${item.variant} • `}Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="font-medium text-[#1e3d2f]">₹{(item.price * item.quantity).toFixed(2)}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Customer Support Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="bg-[#FF8A5B]/20 rounded-xl p-6 border border-[#FF8A5B]/30 mb-8"
        >
          <h2 className="text-xl font-bold mb-2 text-[#1e3d2f]">Need Help?</h2>
          <p className="text-[#3e554a] mb-4">
            If you have any questions about your order, please contact our support team.
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center text-[#FF8A5B] hover:text-[#e5734d] transition"
          >
            Contact Support
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Continue Shopping Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1 }}
          className="text-center"
        >
          <Link 
            href="/" 
            className="bg-gradient-to-r from-[#FF8A5B] to-[#4ECDC4] text-white px-8 py-3 rounded-lg font-medium inline-block hover:opacity-90 transition shadow-lg"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

// Main page component with Suspense boundary
const OrderConfirmationPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OrderConfirmationContent />
    </Suspense>
  );
};

// Inner component that uses useSearchParams
const OrderConfirmationContent = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) throw new Error("Failed to fetch order");
      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orderId = searchParams.get("orderId");
        if (!orderId) throw new Error("Missing order ID");
        
        const data = await fetchOrderDetails(orderId);
        setOrderDetails(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [searchParams]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    const orderId = searchParams.get("orderId");
    if (orderId) {
      fetchOrderDetails(orderId)
        .then(setOrderDetails)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={handleRetry} />;
  if (!orderDetails) return <ErrorDisplay error="No order data found" onRetry={handleRetry} />;

  return <OrderContent orderDetails={orderDetails} />;
};

export default OrderConfirmationPage;