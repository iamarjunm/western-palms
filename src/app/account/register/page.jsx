"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { useUser } from "@/context/UserContext";
import Loader from "@/components/Loader";
import { loginCustomer } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    try {
      // 1. Registration API call
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
  
      // 2. Immediately log the user in
      const result = await loginCustomer(formData.email, formData.password);
  
      if (result) {
        // Store token and expiration
        localStorage.setItem("shopifyAccessToken", result.token);
        localStorage.setItem("expiresAt", result.expiresAt);
  
        // 3. Fetch user data
        const userResponse = await fetch("/api/user", {
          headers: { Authorization: `Bearer ${result.token}` }
        });
        
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
  
        const userData = await userResponse.json();
        
        // 4. Update user context
        login(result.token, userData);
  
        // 5. Redirect to account page
        router.push("/account");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex">
      {/* Left column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full mx-auto"
        >
          <Link href="/" className="block mb-12">
            <Logo className="h-8 text-[#1e3d2f]" />
          </Link>

          <h1 className="text-3xl font-medium text-[#1e3d2f] mb-2">
            Create Account
          </h1>
          <p className="text-[#3e554a] mb-8">
            Join Western Palms to save your favorites, track orders, and enjoy
            exclusive benefits.
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-[#3e554a] mb-1">
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-[#3e554a]" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-[#e4dfd7] rounded-lg focus:ring-2 focus:ring-[#1e3d2f] focus:border-[#1e3d2f] bg-white"
                  placeholder="First Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-[#3e554a] mb-1">
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-[#3e554a]" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-[#e4dfd7] rounded-lg focus:ring-2 focus:ring-[#1e3d2f] focus:border-[#1e3d2f] bg-white"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#3e554a] mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-[#3e554a]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-[#e4dfd7] rounded-lg focus:ring-2 focus:ring-[#1e3d2f] focus:border-[#1e3d2f] bg-white"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#3e554a] mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-[#3e554a]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 border border-[#e4dfd7] rounded-lg focus:ring-2 focus:ring-[#1e3d2f] focus:border-[#1e3d2f] bg-white"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-[#3e554a]">
                Minimum 8 characters with at least one number
              </p>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-1 border-[#e4dfd7] rounded text-[#1e3d2f] focus:ring-[#1e3d2f]"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-[#3e554a]">
                I agree to the{" "}
                <Link href="/terms" className="text-[#1e3d2f] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#1e3d2f] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center px-6 py-4 bg-[#1e3d2f] text-white rounded-lg hover:bg-[#2d5c46] transition-all"
            >
              {isLoading ? (
                <Loader className="h-5 w-5" />
              ) : (
                <>
                  <span className="font-medium">Create Account</span>
                  <FiArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm text-[#3e554a]">
            <p>
              Already have an account?{" "}
              <Link
                href="/account/login"
                className="font-medium text-[#1e3d2f] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right column - Visual */}
      <div className="hidden lg:block lg:w-1/2 bg-[#1e3d2f] relative">
        <div className="absolute inset-0 bg-[url('/auth-pattern.svg')] bg-repeat opacity-10" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center max-w-md"
          >
            <h2 className="text-3xl font-medium text-white mb-4">
              Join the Community
            </h2>
            <p className="text-white/80 mb-8">
            Become part of Western Palms and enjoy a better personalized
            experience.
            </p>
            <div className="flex justify-center">
              <div className="space-y-4 text-left">
                {[
                  "Early access to new arrivals",
                  "Exclusive member discounts",
                  "Personalized style recommendations",
                  "Faster checkout experience"
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center"
                  >
                    <div className="flex-shrink-0 bg-white/10 p-1 rounded-full mr-3">
                      <CheckIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/90">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Logo({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 50"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20,10 L40,30 L60,10 L80,30 L100,10 L120,30"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <text
        x="150"
        y="45"
        fontFamily="Arial"
        fontSize="20"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        WESTERN PALMS
      </text>
    </svg>
  );
}


function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  );
}