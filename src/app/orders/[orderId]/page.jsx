"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle, Truck, CreditCard, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";

const OrderDetailsPage = ({ params }) => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const unwrappedParams = React.use(params);
  const orderId = unwrappedParams?.orderId;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderId) throw new Error("Missing order ID");

        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch order");
        }
        
        const data = await response.json();
        if (!data) throw new Error("Order data not found");
        
        setOrderDetails(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#4ECDC4]" />
          <h1 className="text-2xl font-bold text-[#1e3d2f]">Loading your order details</h1>
          <p className="text-[#3e554a]">Please wait while we fetch your order</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50 flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <div className="space-y-2">
            <AlertCircle className="h-12 w-12 text-[#FF8A5B] mx-auto" />
            <h1 className="text-2xl font-bold text-[#1e3d2f]">Order Not Found</h1>
            <p className="text-[#3e554a]">{error}</p>
            <p className="text-sm text-[#3e554a]/70">Order ID: {orderId}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-[#4ECDC4] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#3ab9b0] transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button and header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#4ECDC4] hover:text-[#3ab9b0] mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Orders
          </button>
          
          <h1 className="text-3xl font-extrabold mb-2 text-[#1e3d2f]">
            Order #{orderDetails?.orderNumber}
          </h1>
          <p className="text-[#3e554a]">
            Placed on {formatDate(orderDetails?.createdAt)}
          </p>
        </motion.div>

        {/* Order status indicator */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-xl p-4 mb-8 border border-white/20 flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${
              orderDetails?.paymentStatus === 'paid' ? 'bg-[#4ECDC4]' :
              orderDetails?.paymentStatus === 'pending' ? 'bg-[#FF8A5B]' :
              orderDetails?.paymentStatus === 'cancelled' ? 'bg-red-500' :
              'bg-gray-500'
            }`}></div>
            <span className="capitalize text-[#1e3d2f]">
              {orderDetails?.paymentStatus?.replace(/_/g, ' ').toLowerCase()}
            </span>
          </div>
          {orderDetails?.trackingInfo && (
            <a
              href={orderDetails.trackingInfo.trackingUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4ECDC4] hover:underline text-sm"
            >
              Track Package
            </a>
          )}
        </motion.div>

        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1e3d2f]">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#3e554a]">Payment Method</span>
                <span className="capitalize text-[#1e3d2f]">
                  {orderDetails?.paymentMethod || 'Not specified'}
                </span>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg"
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
                
                <div className="flex justify-between">
                  <span className="text-[#3e554a]">Address</span>
                  <div className="text-right text-[#1e3d2f]">
                    <div>{orderDetails?.shippingAddress?.firstName} {orderDetails?.shippingAddress?.lastName}</div>
                    <div className="text-[#3e554a] text-sm">
                      {orderDetails?.shippingAddress?.address1}
                    </div>
                  </div>
                </div>
                
                {orderDetails?.trackingInfo ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[#3e554a]">Tracking</span>
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
                      <span className="capitalize text-[#1e3d2f]">
                        {orderDetails.trackingInfo.status || 'Processing'}
                      </span>
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg mb-8"
        >
          <h2 className="text-xl font-bold mb-4 text-[#1e3d2f]">Order Items</h2>
          <div className="divide-y divide-[#d1d9d5]">
            {orderDetails?.items?.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
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
                  <p className="text-sm text-[#3e554a] mt-1">
                    ₹{item.price.toFixed(2)} each
                  </p>
                </div>
                <div className="font-medium text-[#1e3d2f]">₹{(item.price * item.quantity).toFixed(2)}</div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t border-[#d1d9d5] pt-4 mt-4">
            <div className="flex justify-between py-2">
              <span className="text-[#3e554a]">Subtotal</span>
              <span className="text-[#1e3d2f]">₹{orderDetails?.total?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#3e554a]">Shipping</span>
              <span className="text-[#1e3d2f]">{requiresShipping ? 'Calculated at checkout' : 'Free'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#3e554a]">Tax</span>
              <span className="text-[#1e3d2f]">Included</span>
            </div>
            <div className="flex justify-between pt-4 font-bold text-lg border-t border-[#d1d9d5]">
              <span className="text-[#1e3d2f]">Total</span>
              <span className="text-[#1e3d2f]">₹{orderDetails?.total?.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Invoice Section */}
        {orderDetails?.invoiceUrl ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg mb-8"
          >
            <h2 className="text-xl font-bold mb-4 text-[#1e3d2f]">Order Invoice</h2>
            <div className="flex flex-col space-y-4">
              <iframe 
                src={orderDetails.invoiceUrl}
                className="w-full h-[600px] border border-[#d1d9d5] rounded-lg"
                title="Shopify Invoice"
                loading="lazy"
              />
              <div className="flex gap-4">
                <a
                  href={orderDetails.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#4ECDC4] text-white px-4 py-2 rounded hover:bg-[#3ab9b0] transition"
                >
                  Open Full Invoice
                </a>
                <button 
                  onClick={() => window.open(orderDetails.invoiceUrl, '_blank')?.print()}
                  className="bg-[#1e3d2f] text-white px-4 py-2 rounded hover:bg-[#2a4f3f] transition"
                >
                  Print Invoice
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg mb-8"
          >
            <p className="text-[#3e554a]">Invoice not available for this order</p>
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
          transition={{ duration: 0.4, delay: 0.9 }}
          className="text-center"
        >
          <Link 
            href="/products" 
            className="bg-gradient-to-r from-[#FF8A5B] to-[#4ECDC4] text-white px-8 py-3 rounded-lg font-medium inline-block hover:opacity-90 transition shadow-lg"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;