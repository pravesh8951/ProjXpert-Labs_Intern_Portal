"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "AI Intern",
      content: "The 2-month AI internship completely changed my perspective. Building the Image Classifier from scratch gave me the confidence to crack my first job.",
      rating: 5,
      avatar: "R"
    },
    {
      name: "Priya Patel",
      role: "Cybersecurity Intern",
      content: "The live classes at 8 PM were perfect for my college schedule. The mentors are incredibly knowledgeable and helped me find my first bug bounty.",
      rating: 5,
      avatar: "P"
    },
    {
      name: "Amit Kumar",
      role: "AI Intern",
      content: "The daily learning path keeps you disciplined. I loved the text-to-speech audio notes for quick revision while traveling.",
      rating: 5,
      avatar: "A"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[var(--background)] transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
          >
            Student <span className="text-gradient">Success Stories</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl glass-card border border-white/5 relative group"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5 group-hover:text-primary/20 transition-colors" />
              
              <div className="flex text-primary mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-8 relative z-10 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
