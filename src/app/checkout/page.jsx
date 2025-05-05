"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import UserInformationForm from "@/components/checkout/UserInformationForm";
import ShippingAddressForm from "@/components/checkout/ShippingAddressForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentButton from "@/components/checkout/PaymentButton";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft, FiAlertCircle, FiShoppingBag, FiLock } from "react-icons/fi";

const CheckoutPage = () => {
  const { cart } = useCart();
  const { user } = useUser();
  const router = useRouter();

  // Redirect if cart is empty or user not logged in
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
      return;
    }

    if (!user) {
      sessionStorage.setItem('checkoutRedirect', '/checkout');
      router.push("/account/login");
    }
  }, [cart, user, router]);

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    alternateContactNumber: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    company: "",
    address1: user?.address?.address1 || "",
    address2: user?.address?.address2 || "",
    city: user?.address?.city || "",
    country: user?.address?.country || "India",
    zip: user?.address?.zip || "",
    province: user?.address?.province || "",
    phone: user?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email || prev.email
      }));
      
      setShippingAddress(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        phone: user.phone || prev.phone,
        ...(user.address ? {
          address1: user.address.address1,
          address2: user.address.address2,
          city: user.address.city,
          country: user.address.country,
          zip: user.address.zip,
          province: user.address.province
        } : {})
      }));
    }
  }, [user]);
  

  useEffect(() => {
    if (!user) return;
    
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }
    
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.error("Missing Razorpay key ID in env");
      setError("Payment system error. Please contact support.");
      return;
    }    
  
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      setError("Failed to load payment processor. Please refresh the page.");
    };
    document.body.appendChild(script);
  
    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingAddressSubmit = (address) => {
    setShippingAddress(address);
  };

  const updateAddress = async (address) => {
    try {
      const token = localStorage.getItem("shopifyAccessToken");
      const response = await fetch("/api/update-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error("Failed to update address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("Please login to complete your purchase");
      sessionStorage.setItem('checkoutRedirect', '/checkout');
      router.push("/account/login");
      return;
    }
    
    setLoading(true);
    setError("");
  
    try {
      if (!formData.email) throw new Error("Email is required");
      if (!shippingAddress.phone) throw new Error("Phone number is required");
  
      const razorpayResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: cart.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price
          })),
          email: formData.email,
          shippingAddress,
          totalAmount: total
        }),
      });
  
      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json();
        throw new Error(errorData.error || "Payment initialization failed");
      }
  
      const { orderId: razorpayOrderId } = await razorpayResponse.json();
  
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        name: "Western Palms",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            setLoading(true);
            
            const orderResponse = await fetch("/api/create-shopify-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                cart: cart.map(item => ({
                  variantId: item.variantId,
                  quantity: item.quantity,
                  price: item.price
                })),
                email: formData.email,
                shippingAddress: {
                  ...shippingAddress,
                  countryCode: 'IN'
                },
                totalAmount: total
              }),
            });
  
            if (!orderResponse.ok) {
              const errorData = await orderResponse.json();
              throw new Error(errorData.error || "Order creation failed");
            }
  
            const orderData = await orderResponse.json();
            router.push(`/order-confirmation?orderId=${orderData.orderId}`);
            
          } catch (error) {
            console.error("Order processing error:", error);
            setError(`Payment succeeded but order failed. Contact support with ID: ${response.razorpay_payment_id}`);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: shippingAddress.phone,
        },
        notes: {
          internalNote: "Created via web checkout"
        }
      });
  
      rzp.on("payment.failed", (response) => {
        setError(`Payment failed: ${response.error.description}`);
      });
  
      rzp.open();
  
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6]/20 to-[#F8E1C8]/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-8 text-center">
          <FiLock className="mx-auto text-[#3e554a] mb-4" size={32} />
          <h2 className="text-2xl font-bold text-[#1e3d2f] mb-3">Login Required</h2>
          <p className="text-[#3e554a] mb-6">You need to be logged in to proceed with checkout.</p>
          <div className="flex flex-col gap-3">
            <Link 
              href="/account/login" 
              className="bg-[#1e3d2f] text-white py-3 px-6 rounded-md font-medium hover:bg-[#3e554a] transition-colors"
              onClick={() => sessionStorage.setItem('checkoutRedirect', '/checkout')}
            >
              Login
            </Link>
            <Link 
              href="/account/register" 
              className="border border-[#1e3d2f] text-[#1e3d2f] py-3 px-6 rounded-md font-medium hover:bg-[#FFE8D6]/30 transition-colors"
              onClick={() => sessionStorage.setItem('checkoutRedirect', '/checkout')}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6]/20 to-[#F8E1C8]/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/20 p-8 text-center">
          <FiShoppingBag className="mx-auto text-[#3e554a] mb-4" size={32} />
          <h2 className="text-2xl font-bold text-[#1e3d2f] mb-3">Your Cart is Empty</h2>
          <p className="text-[#3e554a] mb-6">Add some products to your cart before checking out.</p>
          <Link 
            href="/shop" 
            className="bg-[#1e3d2f] text-white py-3 px-6 rounded-md font-medium hover:bg-[#3e554a] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE8D6]/20 to-[#F8E1C8]/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/cart" className="flex items-center text-[#1e3d2f] hover:text-[#3e554a] mb-6">
          <FiArrowLeft className="mr-2" size={18} />
          Back to Cart
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-[#1e3d2f] mb-8">Checkout</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md flex items-center">
            <FiAlertCircle className="mr-2" />
            <p className="font-medium">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <UserInformationForm 
              formData={formData} 
              handleChange={handleChange} 
              user={user} 
            />
            <ShippingAddressForm
              formData={shippingAddress}
              handleChange={handleShippingAddressChange}
              user={user}
              updateAddress={updateAddress}
              onSubmit={handleShippingAddressSubmit}
            />
          </div>

          <div className="space-y-6">
            <OrderSummary 
              cart={cart} 
              setTotal={setTotal}
            />
            <PaymentButton
              loading={loading}
              onClick={handleSubmit}
              cart={cart}
              razorpayLoaded={razorpayLoaded}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;