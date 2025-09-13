"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Client",
    location: "Melbourne",
    content:
      "EverKind has been a lifesaver for our family. Their personal activities support has given my mother the independence she needed while ensuring her safety. The staff are incredibly compassionate and professional.",
    rating: 5,
    service: "Personal Activities",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Family Member",
    location: "Sydney",
    content:
      "The travel and transport service has been amazing. They've helped my brother attend all his medical appointments and social activities. The drivers are always punctual and friendly.",
    rating: 5,
    service: "Travel & Transport",
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Client",
    location: "Brisbane",
    content:
      "The nursing care provided by EverKind is exceptional. The nurses are highly skilled and genuinely care about my wellbeing. I feel safe and supported in my own home.",
    rating: 5,
    service: "Nursing Care",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Family Member",
    location: "Perth",
    content:
      "EverKind's daily tasks support has made such a difference in our lives. They help with everything from meal preparation to household management. Highly recommended!",
    rating: 5,
    service: "Daily Tasks",
  },
  {
    id: 5,
    name: "Lisa Rodriguez",
    role: "Client",
    location: "Adelaide",
    content:
      "The life skills development program has been transformative. I've gained so much confidence and independence. The support workers are patient and encouraging.",
    rating: 5,
    service: "Life Skills",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Family Member",
    location: "Hobart",
    content:
      "EverKind's household tasks service has been invaluable. They keep everything clean and organized, allowing us to focus on spending quality time together.",
    rating: 5,
    service: "Household Tasks",
  },
];

export default function Testimonials() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-20 bg-gradient-to-br from-accent/10 via-muted/20 to-primary/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <Badge variant="secondary" className="w-fit mx-auto">
            Client Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Hear from the families and individuals whose lives have been
            transformed through our compassionate community support services.
          </p>
        </motion.div>

        {/* Scrolling Testimonials */}
        <div className="relative overflow-hidden">
          <motion.div
            className="flex space-x-6"
            animate={{
              x: [0, -100 * testimonials.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
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
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80"
              >
                <Card className="h-full border-0 shadow-lg bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Rating */}
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Content */}
                      <p className="text-muted-foreground leading-relaxed">
                        "{testimonial.content}"
                      </p>

                      {/* Service Badge */}
                      <Badge variant="outline" className="w-fit">
                        {testimonial.service}
                      </Badge>

                      {/* Author */}
                      <div className="flex items-center space-x-3 pt-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`/avatars/${testimonial.name
                              .toLowerCase()
                              .replace(" ", "-")}.jpg`}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {testimonial.role} • {testimonial.location}
                          </div>
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
          className="text-center mt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">
                Client Satisfaction
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">
                Happy Families
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5★</div>
              <div className="text-sm text-muted-foreground">
                Average Rating
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
