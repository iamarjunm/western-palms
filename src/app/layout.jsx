// app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"
import "../Styles/globals.css";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Western Palms",
  description: "Dress Beyond Ordinary – Explore chic and modern fashion at Western Palms.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} 
          antialiased bg-[#f7f3ee] text-[#1e3d2f] 
          min-h-screen flex flex-col
        `}
      >
        <UserProvider>
          <WishlistProvider>
            <CartProvider>
        {/* Global Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>

        <Footer />
        </CartProvider>
          </WishlistProvider>
        </UserProvider>

        {/* Optional: Add Footer here if needed */}
      </body>
      
    </html>
  );
}
