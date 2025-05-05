import React from "react";
import formatCurrency from "@/lib/formatCurrency";
import { motion } from "framer-motion";
import { FiShoppingBag } from "react-icons/fi";

const OrderSummary = ({ cart, setTotal }) => {
  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calculate shipping cost  
  // Calculate total
  const total = subtotal;
  
  // Update parent component with total
  React.useEffect(() => {
    setTotal(total);
  }, [total, setTotal]);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-6">
      <h2 className="text-xl font-bold text-[#1e3d2f] mb-6 flex items-center">
        <FiShoppingBag className="mr-2" />
        Order Summary
      </h2>

      <div className="space-y-4">
        {/* Cart items */}
        {cart.map((item) => (
          <motion.div 
            key={`${item.id}-${item.variantId}`}
            className="flex justify-between items-start py-3 border-b border-[#d1d9d5]/30 last:border-b-0"
            whileHover={{ x: 2 }}
          >
            <div className="flex-1">
              <p className="font-medium text-[#1e3d2f]">{item.title}</p>
              {item.variantTitle && (
                <p className="text-sm text-[#3e554a]">{item.variantTitle}</p>
              )}
              <p className="text-sm text-[#3e554a]">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium text-[#1e3d2f] ml-4 whitespace-nowrap">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </motion.div>
        ))}

        {/* Subtotal */}
        <div className="flex justify-between pt-2">
          <p className="text-[#3e554a]">Subtotal</p>
          <p className="text-[#1e3d2f] font-medium">
            {formatCurrency(subtotal)}
          </p>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-[#d1d9d5] mt-4">
          <p className="text-lg font-bold text-[#1e3d2f]">Total</p>
          <p className="text-lg font-bold text-[#1e3d2f]">
            {formatCurrency(total)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;