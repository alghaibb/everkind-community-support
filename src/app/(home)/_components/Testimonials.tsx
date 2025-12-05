"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { testimonials } from "../constants";
import { Quote, Star } from "lucide-react";

export default function Testimonials() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative py-16 sm:py-20 lg:py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-muted/20" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="max-w-[1800px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="flex items-center justify-center gap-2">
            <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-primary/30" />
            <Badge
              variant="glass"
              className="w-fit text-sm sm:text-base px-4 py-2"
            >
              Client Testimonials
            </Badge>
            <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-primary/30 rotate-180" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="block">What Our</span>
            <span className="block mt-2 text-gradient-animate">
              Clients Say
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Hear from the{" "}
            <span className="font-semibold text-foreground">
              families and individuals
            </span>{" "}
            whose lives have been transformed through our compassionate
            community support services.
          </p>
        </motion.div>

        {/* Scrolling Testimonials */}
        <div className="relative overflow-hidden py-4">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex space-x-4 sm:space-x-6"
            animate={{
              x: [0, -100 * testimonials.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate testimonials for seamless loop */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={`${testimonial.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-[320px] sm:w-[380px]"
              >
                <Card className="h-full border-border/50 shadow-soft-lg hover:shadow-glow transition-all duration-500 bg-card/95 backdrop-blur-sm hover:-translate-y-1 group">
                  <CardContent className="p-6 sm:p-8 space-y-4 sm:space-y-6">
                    {/* Quote Icon */}
                    <div className="flex items-start justify-between">
                      <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-primary/20 group-hover:text-primary/40 transition-colors" />

                      {/* Rating */}
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                          >
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>

                    {/* Service Badge */}
                    <Badge variant="success" className="w-fit">
                      {testimonial.service}
                    </Badge>

                    {/* Author */}
                    <div className="flex items-center space-x-3 pt-2 border-t border-border/50">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                        <AvatarImage
                          src={`/avatars/${testimonial.name
                            .toLowerCase()
                            .replace(" ", "-")}.jpg`}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-foreground truncate">
                          {testimonial.name}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground truncate">
                          {testimonial.role} • {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 lg:mt-20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            {[
              {
                value: "98%",
                label: "Client Satisfaction",
                icon: "😊",
                delay: 0,
              },
              {
                value: "500+",
                label: "Happy Families",
                icon: "❤️",
                delay: 0.1,
              },
              { value: "5★", label: "Average Rating", icon: "⭐", delay: 0.2 },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + stat.delay }}
                viewport={{ once: true }}
                className="text-center p-6 sm:p-8 rounded-3xl glass-light hover:glass transition-all duration-300 hover-lift"
              >
                <div className="text-3xl sm:text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
