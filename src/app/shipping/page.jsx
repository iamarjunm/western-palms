"use client";

import { motion } from "framer-motion";
import { FiTruck, FiPackage, FiClock, FiXCircle } from "react-icons/fi";
import Image from "next/image";

const ShippingInfoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#1e3d2f] mb-6 text-center">
            Shipping Information
          </h1>

          {/* Official Partner Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-48 h-16 mb-4">
              <Image
                src="/delhivery-logo.png"
                alt="Delhivery Official Partner"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="text-lg text-[#3e554a] text-center">
              We proudly partner with Delhivery for all our shipping needs, ensuring
              fast and reliable delivery across India.
            </p>
          </div>

          {/* Shipping Policies */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Delivery Timeline */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-[#d1d9d5]"
            >
              <div className="flex items-center mb-4">
                <FiClock className="text-2xl text-[#1e3d2f] mr-3" />
                <h3 className="text-xl font-bold text-[#1e3d2f]">
                  Delivery Timeline
                </h3>
              </div>
              <ul className="space-y-2 text-[#3e554a]">
                <li>• Standard delivery: 3-7 business days</li>
                <li>• Metro cities: Typically 3-5 days</li>
                <li>• Remote areas: May take up to 7 days</li>
                <li>• Dispatch within 24-48 hours of order</li>
              </ul>
            </motion.div>

            {/* Shipping Coverage */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-[#d1d9d5]"
            >
              <div className="flex items-center mb-4">
                <FiTruck className="text-2xl text-[#1e3d2f] mr-3" />
                <h3 className="text-xl font-bold text-[#1e3d2f]">
                  Shipping Coverage
                </h3>
              </div>
              <ul className="space-y-2 text-[#3e554a]">
                <li>• Serviceable across all Indian pin codes</li>
                <li>• Free shipping on orders</li>
                <li>• Real-time tracking available</li>
              </ul>
            </motion.div>
          </div>

          {/* Payment Policy */}
          <div className="bg-[#FFE8D6] p-6 rounded-lg mb-8">
            <div className="flex items-center mb-4">
              <FiXCircle className="text-2xl text-red-500 mr-3" />
              <h3 className="text-xl font-bold text-[#1e3d2f]">
                Payment Policy
              </h3>
            </div>
            <div className="text-[#3e554a] space-y-2">
              <p>
                <strong>Prepaid Orders Only:</strong> We currently accept only prepaid orders
                through our secure payment gateway. Cash on Delivery (COD) is not available.
              </p>
              <p>
                All transactions are encrypted for your security. We accept credit/debit cards,
                UPI, net banking, and popular wallets.
              </p>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-[#d1d9d5]">
            <div className="flex items-center mb-4">
              <FiPackage className="text-2xl text-[#1e3d2f] mr-3" />
              <h3 className="text-xl font-bold text-[#1e3d2f]">
                Track Your Order
              </h3>
            </div>
            <p className="text-[#3e554a] mb-4">
              You'll receive a Delhivery tracking number via SMS and email as soon as
              your order is dispatched. Track your package directly on Delhivery's website
              or through our order tracking page.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShippingInfoPage;