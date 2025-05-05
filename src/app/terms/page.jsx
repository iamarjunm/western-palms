"use client";

import { motion } from "framer-motion";
import { FiShoppingBag, FiCreditCard, FiAlertTriangle, FiBookmark, FiTruck } from "react-icons/fi";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6] to-[#F8E1C8]/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-8"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1e3d2f] mb-3">
              Terms & Conditions
            </h1>
            <p className="text-lg text-[#3e554a]">
              Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose max-w-none text-[#3e554a] space-y-10">
            {/* Introduction */}
            <div>
              <p>
                Welcome to Western Palms. These Terms & Conditions govern your use of our website and services. 
                By accessing or purchasing from our site, you agree to be bound by these terms.
              </p>
            </div>

            {/* Ordering Process */}
            <div>
              <div className="flex items-center mb-4">
                <FiShoppingBag className="text-2xl text-[#1e3d2f] mr-3" />
                <h2 className="text-2xl font-bold text-[#1e3d2f]">
                  Ordering & Purchases
                </h2>
              </div>
              <ul className="space-y-3 pl-5">
                <li>• All orders are subject to product availability</li>
                <li>• We reserve the right to refuse or cancel any order</li>
                <li>• Prices are subject to change without notice</li>
                <li>• <strong>Prepaid orders only</strong> - we do not accept cash on delivery</li>
                <li>• You must provide accurate billing and shipping information</li>
              </ul>
            </div>

            {/* Payments */}
            <div>
              <div className="flex items-center mb-4">
                <FiCreditCard className="text-2xl text-[#1e3d2f] mr-3" />
                <h2 className="text-2xl font-bold text-[#1e3d2f]">
                  Payment Terms
                </h2>
              </div>
              <ul className="space-y-3 pl-5">
                <li>• We accept major credit cards, UPI, and net banking</li>
                <li>• Payment is processed at time of order confirmation</li>
                <li>• Your card will be charged when order is processed</li>
                <li>• We are not responsible for bank transfer delays</li>
              </ul>
            </div>

            {/* Shipping */}
            <div>
              <div className="flex items-center mb-4">
                <FiTruck className="text-2xl text-[#1e3d2f] mr-3" />
                <h2 className="text-2xl font-bold text-[#1e3d2f]">
                  Shipping Policy
                </h2>
              </div>
              <ul className="space-y-3 pl-5">
                <li>• We ship nationwide via Delhivery</li>
                <li>• Standard delivery takes 3-7 business days</li>
                <li>• Shipping costs are calculated at checkout</li>
                <li>• Risk of loss transfers to buyer upon delivery</li>
                <li>• You are responsible for customs/duties (if applicable)</li>
              </ul>
            </div>

            {/* Returns */}
            <div>
              <div className="flex items-center mb-4">
                <FiAlertTriangle className="text-2xl text-[#1e3d2f] mr-3" />
                <h2 className="text-2xl font-bold text-[#1e3d2f]">
                  Returns & Refunds
                </h2>
              </div>
              <ul className="space-y-3 pl-5">
                <li>• <strong>Strict no return, no exchange policy</strong> except for damaged items</li>
                <li>• Damaged items must be reported within 24 hours of delivery</li>
                <li>• Refunds (if approved) are issued to original payment method</li>
                <li>• Processing time for refunds is 7-10 business days</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div>
              <div className="flex items-center mb-4">
                <FiBookmark className="text-2xl text-[#1e3d2f] mr-3" />
                <h2 className="text-2xl font-bold text-[#1e3d2f]">
                  Intellectual Property
                </h2>
              </div>
              <ul className="space-y-3 pl-5">
                <li>• All website content is our exclusive property</li>
                <li>• Products are for personal use only</li>
                <li>• Commercial use requires written permission</li>
                <li>• Unauthorized reproduction is prohibited</li>
              </ul>
            </div>

            {/* General */}
            <div>
              <h2 className="text-2xl font-bold text-[#1e3d2f] mb-4">
                General Terms
              </h2>
              <ul className="space-y-3 pl-5">
                <li>• We reserve the right to modify these terms at any time</li>
                <li>• Indian law governs these terms</li>
                <li>• Disputes will be resolved in NCR courts</li>
                <li>• If any provision is invalid, the remainder remains enforceable</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;