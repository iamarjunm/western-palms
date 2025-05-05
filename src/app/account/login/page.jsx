// app/login/page.jsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { loginCustomer } from "@/lib/auth";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await loginCustomer(email, password);

      if (result) {
        // Store token and expiration time
        localStorage.setItem("shopifyAccessToken", result.token);
        localStorage.setItem("expiresAt", result.expiresAt);

        // Fetch user data
        const userData = await fetch("/api/user", {
          headers: { Authorization: `Bearer ${result.token}` },
        }).then((res) => res.json());

        // Update user context
        login(result.token, userData);

        setSuccessMessage("Login successful! Redirecting...");
        
        // Redirect after delay
        setTimeout(() => router.push("/account"), 1500);
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
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
            Welcome Back
          </h1>
          <p className="text-[#3e554a] mb-8">
            Sign in to access your account and continue your style journey.
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

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6"
            >
              {successMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-[#e4dfd7] rounded-lg focus:ring-2 focus:ring-[#1e3d2f] focus:border-[#1e3d2f] bg-white"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end mt-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#3e554a] hover:text-[#1e3d2f] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex justify-center items-center px-6 py-4 bg-[#1e3d2f] text-white rounded-lg hover:bg-[#2d5c46] transition-all"
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <span className="font-medium">Sign In</span>
                  <FiArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm text-[#3e554a]">
            <p>
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-[#1e3d2f] hover:underline"
              >
                Create one
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
              Your Style Awaits
            </h2>
            <p className="text-white/80 mb-8">
              Sign in to access your saved items, track orders, and enjoy a
              personalized shopping experience.
            </p>
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-4 max-w-xs">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * item }}
                    className="aspect-square bg-white/10 rounded-lg backdrop-blur-sm"
                  />
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
    <svg className={className} viewBox="0 0 120 40" fill="currentColor">
      <path d="M20,10 L40,30 L60,10 L80,30 L100,10 L120,30" stroke="currentColor" strokeWidth="2" fill="none" />
      <text x="0" y="35" fontFamily="Arial" fontSize="20" fontWeight="bold">WESTERN PALMS</text>
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}