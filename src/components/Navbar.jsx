"use client";

import { useState, useEffect, useRef } from "react";
import { FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const shopDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useUser();
  const router = useRouter();

  // Full category structure
  const shopCategories = [
    {
      label: "All Products", 
      href: "/shop"
    },
    {
      label: "Categories",
      subItems: [
        { label: "Dresses", href: "/categories/dresses" },
        { label: "Tops", href: "/categories/tops" },
        { label: "T-Shirts", href: "/categories/t-shirts" },
        { label: "Shirts", href: "/categories/shirts" },
        { label: "Tank Tops", href: "/categories/tank-tops" },
        { label: "Co-ords", href: "/categories/co-ords" },
        { label: "Jeans", href: "/categories/jeans" },
        { label: "Pants", href: "/categories/pants" },
        { label: "Shorts", href: "/categories/shorts" },
        { label: "Skirts", href: "/categories/skirts" }
      ]
    }
  ];

  const profileItems = user
    ? [
        { label: "My Account", href: "/account" },
        { label: "Orders", href: "/orders" },
        { label: "Logout", action: () => handleLogout() }
      ]
    : [
        { label: "Login", href: "/account/login" },
        { label: "Register", href: "/account/register" }
      ];

  const handleLogout = () => {
    logout();
    router.push("/");
    setMobileOpen(false);
  };

  // Improved hover handling with timeout
  useEffect(() => {
    let shopTimer;
    let profileTimer;

    const handleShopMouseEnter = () => {
      clearTimeout(shopTimer);
      setShopDropdownOpen(true);
    };

    const handleShopMouseLeave = () => {
      shopTimer = setTimeout(() => {
        if (!shopDropdownRef.current?.matches(':hover')) {
          setShopDropdownOpen(false);
        }
      }, 200);
    };

    const handleProfileMouseEnter = () => {
      clearTimeout(profileTimer);
      setProfileDropdownOpen(true);
    };

    const handleProfileMouseLeave = () => {
      profileTimer = setTimeout(() => {
        if (!profileDropdownRef.current?.matches(':hover')) {
          setProfileDropdownOpen(false);
        }
      }, 200);
    };

    const shopElement = shopDropdownRef.current;
    const profileElement = profileDropdownRef.current;

    if (shopElement) {
      shopElement.addEventListener('mouseenter', handleShopMouseEnter);
      shopElement.addEventListener('mouseleave', handleShopMouseLeave);
    }

    if (profileElement) {
      profileElement.addEventListener('mouseenter', handleProfileMouseEnter);
      profileElement.addEventListener('mouseleave', handleProfileMouseLeave);
    }

    return () => {
      if (shopElement) {
        shopElement.removeEventListener('mouseenter', handleShopMouseEnter);
        shopElement.removeEventListener('mouseleave', handleShopMouseLeave);
      }
      if (profileElement) {
        profileElement.removeEventListener('mouseenter', handleProfileMouseEnter);
        profileElement.removeEventListener('mouseleave', handleProfileMouseLeave);
      }
      clearTimeout(shopTimer);
      clearTimeout(profileTimer);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target)) {
        setShopDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header 
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 transition-all duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center hover:opacity-80 transition-opacity"
          aria-label="Home"
        >
          <Image 
            src="/images/logo.png" 
            alt="" 
            width={60} 
            height={60} 
            priority
            className="filter drop-shadow-md"
          />
          <Image 
            src="/images/logotext.png" 
            alt="Western Palms" 
            width={200} 
            height={60} 
            className="hidden sm:block filter drop-shadow-md"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-[#1e3d2f]">
          {/* Shop Dropdown */}
          <div 
            ref={shopDropdownRef}
            className="relative"
          >
            <button 
              className="flex items-center gap-1 group relative"
              onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
            >
              <span className="font-bold">Shop</span>
              <FiChevronDown className={`transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-gradient-to-r from-[#FF6B6B] to-[#FFBE0B] transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            <AnimatePresence>
              {shopDropdownOpen && (
                <motion.div 
                  ref={shopDropdownRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg py-3 w-64 z-50 border border-white/20"
                >
                  {shopCategories.map((category) => (
                    <div key={category.label} className="border-b border-white/20 last:border-0">
                      {category.subItems ? (
                        <div className="px-4 py-2">
                          <p className="font-bold text-[#1e3d2f] mb-2">{category.label}</p>
                          <div className="grid grid-cols-2 gap-1">
                            {category.subItems.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="block px-3 py-1.5 text-sm text-[#3e554a] hover:bg-gradient-to-r from-[#FFE8D6] to-[#F8E1C8] rounded transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={category.href}
                          className="block px-4 py-2 font-medium text-[#1e3d2f] hover:bg-gradient-to-r from-[#FFE8D6] to-[#F8E1C8] rounded transition-colors"
                        >
                          {category.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Other Links */}
          {["About", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="relative group font-bold"
              aria-label={item}
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-gradient-to-r from-[#3A86FF] to-[#4ECDC4] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

          {/* Wishlist */}
          <Link href="/wishlist" className="relative hover:text-[#FF6B6B] transition-colors">
            <FiHeart className="text-xl" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF6B6B] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative hover:text-[#3A86FF] transition-colors">
            <FiShoppingBag className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-[#3A86FF] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
              {cart.length}
            </span>
          </Link>

          {/* Profile Dropdown */}
          <div 
            ref={profileDropdownRef}
            className="relative"
          >
            <button 
              className="flex items-center gap-1 hover:text-[#8338EC] transition-colors"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <FiUser className="text-xl" />
              <FiChevronDown className={`text-sm transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.div 
                  ref={profileDropdownRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-lg py-1 w-48 z-50 border border-white/20"
                >
                  {profileItems.map((item) => (
                    item.href ? (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block px-4 py-2 text-[#1e3d2f] hover:bg-gradient-to-r from-[#FFE8D6] to-[#F8E1C8] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="block w-full text-left px-4 py-2 text-[#1e3d2f] hover:bg-gradient-to-r from-[#FFE8D6] to-[#F8E1C8] transition-colors"
                      >
                        {item.label}
                      </button>
                    )
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4 text-2xl text-[#1e3d2f]">
          <Link href="/wishlist" className="relative hover:text-[#FF6B6B] transition-colors">
            <FiHeart className="text-xl" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative hover:text-[#3A86FF] transition-colors">
            <FiShoppingBag className="text-xl" />
            <span className="absolute -top-1 -right-1 bg-[#3A86FF] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
              {cart.length}
            </span>
          </Link>
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="hover:text-[#8338EC] transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-white/20"
            ref={mobileMenuRef}
          >
            <div className="px-4 pb-4 pt-2 space-y-1">
              {/* Mobile Shop Dropdown */}
              <div className="border-b border-white/20 pb-2">
                <button 
                  onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                  className="flex items-center justify-between w-full py-3 text-[#1e3d2f] text-base font-bold"
                >
                  <span>Shop</span>
                  <FiChevronDown className={`transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {shopDropdownOpen && (
                  <div className="pl-4 space-y-1">
                    {shopCategories.map((category) => (
                      <div key={category.label} className="border-t border-white/20 pt-1">
                        {category.subItems ? (
                          <>
                            <p className="font-bold py-2">{category.label}</p>
                            <div className="grid grid-cols-2 gap-1 pl-2">
                              {category.subItems.map((item) => (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  className="block py-2 text-sm text-[#3e554a] hover:bg-gradient-to-r from-[#FFE8D6] to-[#F8E1C8] px-2 rounded transition-colors"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </>
                        ) : (
                          <Link
                            href={category.href}
                            className="block py-2 font-medium text-[#1e3d2f] hover:bg-gradient-to-r from-[#FFE8D6] to-[#F8E1C8] px-2 rounded transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {category.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Mobile Links */}
              {["About", "Contact"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + (index * 0.05) }}
                >
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="block py-3 text-[#1e3d2f] text-base font-bold hover:bg-gradient-to-r from-[#FFE8D6] to-[#F8E1C8] px-2 rounded transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Profile Dropdown */}
              <div className="border-t border-white/20 pt-2">
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center justify-between w-full py-3 text-[#1e3d2f] text-base font-bold"
                >
                  <span>Account</span>
                  <FiChevronDown className={`transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileDropdownOpen && (
                  <div className="pl-4 space-y-1">
                    {profileItems.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + (index * 0.05) }}
                      >
                        {item.href ? (
                          <Link
                            href={item.href}
                            className="block py-2 text-[#3e554a] hover:bg-gradient-to-r from-[#FFE8D6] to-[#F8E1C8] px-2 rounded transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <button
                            onClick={() => {
                              item.action();
                              setMobileOpen(false);
                            }}
                            className="block w-full text-left py-2 text-[#3e554a] hover:bg-gradient-to-r from-[#FFE8D6] to-[#F8E1C8] px-2 rounded transition-colors"
                          >
                            {item.label}
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}