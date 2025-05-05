"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    quote: "The linen dress exceeded all expectations. I've received endless compliments and the quality is exceptional.",
    author: "Sophia K.",
    location: "Santa Monica, CA",
    rating: 5,
    image: "/testimonials/testimonial-1.jpg"
  },
  {
    id: 2,
    quote: "Western Palms has become my go-to for elevated basics. Their pieces transition perfectly from beach to dinner.",
    author: "Marcus T.",
    location: "Austin, TX",
    rating: 5,
    image: "/testimonials/testimonial-2.jpg"
  },
  {
    id: 3,
    quote: "The co-ords are my new wardrobe staples. The fabric feels luxurious while being incredibly comfortable.",
    author: "Elena R.",
    location: "Miami, FL",
    rating: 4,
    image: "/testimonials/testimonial-3.jpg"
  },
  {
    id: 4,
    quote: "I appreciate their sustainable approach without compromising on style. The desert pants are everything!",
    author: "Jordan L.",
    location: "Portland, OR",
    rating: 5,
    image: "/testimonials/testimonial-4.jpg"
  }
];

export default function CustomerLove() {
  return (
    <section className="relative py-32 bg-[#1e3d2f] text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 -translate-y-full bg-gradient-to-b from-transparent to-[#1e3d2f] z-10" />
      <div className="absolute top-0 right-0 opacity-5">
        <PalmClusterIcon className="w-96 h-96 text-white" />
      </div>

      {/* Section content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "0px 0px -50px 0px", once: true }}
          className="mb-20 text-center"
        >
          <h2 className="text-5xl font-medium mb-4">Customer Love</h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Hear from those who've made Western Palms part of their story
          </p>
        </motion.div>

        {/* Testimonial slider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: "0px 0px -100px 0px", once: true }}
          transition={{ delay: 0.2 }}
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            breakpoints={{
              768: {
                slidesPerView: 2
              }
            }}
            className="pb-16"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "0px 0px -50px 0px", once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 text-center"
        >
          <div className="p-6">
            <p className="text-4xl font-light mb-2">2000+</p>
            <p className="text-sm uppercase tracking-wider text-white/70">Happy Customers</p>
          </div>
          <div className="p-6">
            <p className="text-4xl font-light mb-2">4.9★</p>
            <p className="text-sm uppercase tracking-wider text-white/70">Average Rating</p>
          </div>
          <div className="p-6">
            <p className="text-4xl font-light mb-2">24</p>
            <p className="text-sm uppercase tracking-wider text-white/70">Sustainable Materials</p>
          </div>
          <div className="p-6">
            <p className="text-4xl font-light mb-2">100%</p>
            <p className="text-sm uppercase tracking-wider text-white/70">Ethically Made</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="h-full bg-[#2d5c46]/50 rounded-3xl overflow-hidden backdrop-blur-sm border border-white/10"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Customer image */}
        <div className="relative w-full md:w-1/3 aspect-square">
          <Image
            src={testimonial.image}
            alt={testimonial.author}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
        </div>

        {/* Testimonial content */}
        <div className="w-full md:w-2/3 p-8 flex flex-col justify-center">
          <div className="mb-6">
            <StarRating rating={testimonial.rating} />
          </div>
          
          <blockquote className="text-xl font-light mb-6">
            "{testimonial.quote}"
          </blockquote>
          
          <div>
            <p className="font-medium">{testimonial.author}</p>
            <p className="text-sm text-white/70">{testimonial.location}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
    </div>
  );
}

function StarIcon({ filled }) {
  return (
    <svg
      className={`w-5 h-5 ${filled ? "text-yellow-300" : "text-white/30"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function PalmClusterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor">
      <path d="M240,136c0,48-64,80-112,80S16,184,16,136s64-80,112-80S240,88,240,136Z" />
    </svg>
  );
}