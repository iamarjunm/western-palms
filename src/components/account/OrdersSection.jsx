"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiPackage } from "react-icons/fi";

const OrdersSection = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user?.email) {
          setLoading(false);
          return;
        }

        setLoading(true);
        const response = await fetch(`/api/orders?email=${encodeURIComponent(user.email)}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.email]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return "Unknown date";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Completed';
      case 'pending': return 'Processing';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1e3d2f] mb-6">Your Orders</h2>
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#3e554a]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1e3d2f] mb-6">Your Orders</h2>
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-6 text-red-500 flex items-center">
          <FiPackage className="mr-2" />
          Error loading orders: {error}
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#1e3d2f] mb-6">Your Orders</h2>
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-6 text-center">
          <FiPackage className="mx-auto text-[#3e554a] mb-3" size={32} />
          <p className="text-[#3e554a] mb-4">You haven't placed any orders yet.</p>
          <Link 
            href="/products" 
            className="inline-block bg-[#1e3d2f] text-white px-6 py-2 rounded-md font-medium hover:bg-[#3e554a] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#1e3d2f] mb-6">Your Orders</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <motion.div 
            key={order.id} 
            className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-6"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start">
                <FiPackage className="text-[#3e554a] mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-[#1e3d2f]">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-[#3e554a]">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`h-2 w-2 rounded-full ${getStatusColor(order.status)}`}></span>
                <span className="text-sm text-[#3e554a] capitalize">{getStatusText(order.status)}</span>
              </div>
            </div>

            <div className="mb-4 ml-8">
              {order.lineItems.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center py-2 border-b border-[#d1d9d5]/30 last:border-b-0">
                  {item.image && (
                    <div className="w-12 h-12 bg-gray-100 rounded-md mr-3 overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1e3d2f] truncate">{item.name}</p>
                    <p className="text-sm text-[#3e554a]">
                      {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
              ))}
              {order.lineItems.length > 3 && (
                <p className="text-sm text-[#3e554a] mt-2">
                  +{order.lineItems.length - 3} more items
                </p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#d1d9d5]/30">
              <p className="font-medium text-[#1e3d2f]">{formatCurrency(order.total)}</p>
              <Link 
                href={`/orders/${order.id}`}
                className="text-[#1e3d2f] hover:text-[#3e554a] flex items-center text-sm font-medium"
              >
                View Details <ArrowRight className="ml-1" size={16} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Helper function to format currency (assuming this exists in your project)
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

export default OrdersSection;