// components/ContactForm.jsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus({ success: true, message: "Message sent successfully!" });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      setSubmitStatus({ success: false, message: "Error sending message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#3e554a] mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-[#dcd6cf] rounded-lg focus:ring-2 focus:ring-[#1e3d2f] focus:border-[#1e3d2f] outline-none transition-all"
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#3e554a] mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-[#dcd6cf] rounded-lg focus:ring-2 focus:ring-[#1e3d2f] focus:border-[#1e3d2f] outline-none transition-all"
        />
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-[#3e554a] mb-1">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-[#dcd6cf] rounded-lg focus:ring-2 focus:ring-[#1e3d2f] focus:border-[#1e3d2f] outline-none transition-all bg-white"
        >
          <option value="">Select a subject</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Wholesale">Wholesale</option>
          <option value="Press">Press</option>
          <option value="Returns">Returns</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#3e554a] mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-[#dcd6cf] rounded-lg focus:ring-2 focus:ring-[#1e3d2f] focus:border-[#1e3d2f] outline-none transition-all"
        ></textarea>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 bg-[#1e3d2f] text-[#f7f3ee] rounded-lg hover:bg-[#2d5c46] transition-colors font-medium"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </motion.button>

      {/* Submission Status */}
      {submitStatus && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg text-center ${
            submitStatus.success ? "bg-[#2d5c46]/10 text-[#2d5c46]" : "bg-red-100 text-red-800"
          }`}
        >
          {submitStatus.message}
        </motion.div>
      )}
    </form>
  );
}