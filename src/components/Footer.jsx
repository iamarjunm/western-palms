// components/Footer.jsx
import Link from "next/link";
import Image from "next/image";
import { FiInstagram, FiTwitter, FiFacebook, FiMail } from "react-icons/fi";

export default function Footer() {
  const footerLinks = [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/shop" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "Our Story", href: "/about" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "Shipping Info", href: "/shipping" },
        { label: "Returns & Exchanges", href: "/returns" },
        { label: "FAQ", href: "/faq" },
      ],
    },
  ];

  return (
    <footer className="bg-[#1e3d2f] text-[#f7f3ee] pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Social */}
          <div className="md:col-span-1">
            <p className="mb-4 text-sm opacity-80">
              Handcrafted goods inspired by the natural beauty of the West.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Instagram" className="hover:text-[#dcd6cf] transition-colors">
                <FiInstagram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="mt-4 md:mt-0">
              <h3 className="text-lg font-medium mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-sm opacity-80 hover:opacity-100 hover:text-[#dcd6cf] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="mt-4 md:mt-0">
            <h3 className="text-lg font-medium mb-4">Stay Connected</h3>
            <p className="text-sm opacity-80 mb-4">
              Subscribe for updates and exclusive offers
            </p>
            <form className="flex flex-col gap-2">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-[#2d5c46] text-[#f7f3ee] px-4 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-[#dcd6cf] placeholder-[#a8b8a5]"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-[#dcd6cf] text-[#1e3d2f] px-4 py-2 hover:bg-[#f7f3ee] transition-colors"
                  aria-label="Subscribe"
                >
                  <FiMail />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#2d5c46] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-60">
            © {new Date().getFullYear()} Western Palms. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs opacity-60 hover:opacity-100 transition-opacity">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs opacity-60 hover:opacity-100 transition-opacity">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}