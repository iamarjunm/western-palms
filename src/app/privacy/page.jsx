"use client";

import { motion } from "framer-motion";
import { FiLock, FiUser, FiCreditCard, FiMail, FiServer } from "react-icons/fi";

const PrivacyPolicyPage = () => {
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
              Privacy Policy
            </h1>
            <p className="text-lg text-[#3e554a]">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose max-w-none text-[#3e554a]">
            <div className="mb-10">
              <div className="flex items-center mb-4">
                <FiLock className="text-2xl text-[#1e3d2f] mr-3" />
                <h2 className="text-2xl font-bold text-[#1e3d2f]">
                  Information We Collect
                </h2>
              </div>
              <p className="mb-4">
                At Western Palms, we collect the following types of information when you use our services:
              </p>
              <ul className="space-y-2 pl-5 mb-6">
                <li><strong>Personal Identification:</strong> Name, email address, phone number, shipping/billing address</li>
                <li><strong>Order Information:</strong> Products purchased, order history, payment details</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, cookies</li>
                <li><strong>Usage Data:</strong> How you interact with our website and products</li>
              </ul>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <FiServer className="text-2xl text-[#1e3d2f] mr-3" />
                <h2 className="text-2xl font-bold text-[#1e3d2f]">
                  How We Use Your Information
                </h2>
              </div>
              <ul className="space-y-3 pl-5">
                <li>• To process and fulfill your orders</li>
                <li>• To communicate about your orders and account</li>
                <li>• To improve our products and services</li>
                <li>• To prevent fraud and enhance security</li>
                <li>• To comply with legal obligations</li>
                <li>• For marketing (only with your explicit consent)</li>
              </ul>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <FiCreditCard className="text-2xl text-[#1e3d2f] mr-3" />
                <h2 className="text-2xl font-bold text-[#1e3d2f]">
                  Data Security
                </h2>
              </div>
              <p>
                We implement industry-standard security measures including:
              </p>
              <ul className="space-y-2 pl-5 mt-2 mb-4">
                <li>• SSL/TLS encryption for all data transmissions</li>
                <li>• PCI-DSS compliant payment processing</li>
                <li>• Regular security audits and monitoring</li>
                <li>• Limited employee access to sensitive data</li>
              </ul>
              <p>
                Despite these measures, no method of transmission over the Internet is 100% secure. 
                We cannot guarantee absolute security but we strive to use commercially acceptable 
                means to protect your personal information.
              </p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <FiUser className="text-2xl text-[#1e3d2f] mr-3" />
                <h2 className="text-2xl font-bold text-[#1e3d2f]">
                  Your Rights
                </h2>
              </div>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="space-y-2 pl-5 mb-4">
                <li>• Access the personal data we hold about you</li>
                <li>• Request correction of inaccurate data</li>
                <li>• Request deletion of your personal data</li>
                <li>• Object to processing of your data</li>
                <li>• Request restriction of processing</li>
                <li>• Withdraw consent at any time</li>
              </ul>
              <p>
                To exercise these rights, please contact us at privacy@westernpalms.com. 
                We may require verification of your identity before processing certain requests.
              </p>
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <FiMail className="text-2xl text-[#1e3d2f] mr-3" />
                <h2 className="text-2xl font-bold text-[#1e3d2f]">
                  Contact Us
                </h2>
              </div>
              <p className="mb-2">
                For any questions about this Privacy Policy or our data practices:
              </p>
              <p>
                <strong>Email:</strong> westernpalms29@gmail.com<br />
              </p>
            </div>

            <div className="border-t border-[#d1d9d5] pt-6 text-sm">
              <p>
                <strong>Note:</strong> We may update this Privacy Policy periodically. 
                We will notify you of significant changes by posting the new policy on our website 
                with an updated effective date.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;