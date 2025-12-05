"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, Sparkles } from "lucide-react";

export default function ContactInfo() {
  const contactItems = [
    {
      icon: Phone,
      title: "Phone",
      primary: "(03) 1234 5678",
      secondary: "Mon-Fri: 9AM-5PM",
      badge: "Preferred Contact",
      badgeVariant: "success" as const,
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Mail,
      title: "Email",
      primary: "info@ekcs.com.au",
      secondary: "Response within 24 hours",
      badge: "Business Hours",
      badgeVariant: "secondary" as const,
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: MapPin,
      title: "Office",
      primary: "123 Community Street",
      secondary: "Melbourne VIC 3000",
      extra: "Wheelchair accessible",
      color: "from-rose-500 to-pink-600",
    },
    {
      icon: Clock,
      title: "Hours",
      primary: "Mon-Fri: 9:00 AM - 5:00 PM",
      secondary: "Sat-Sun: Emergency Only",
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 space-y-4"
        >
          <Badge variant="glass" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Contact Information
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Multiple Ways to{" "}
            <span className="text-gradient-animate">Reach Us</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Choose your preferred method of contact
          </p>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="border-border/50 shadow-soft-xl bg-card/95 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {contactItems.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-background/50 border border-border/30 hover:border-primary/30 hover:shadow-soft-lg transition-all duration-300 group"
                  >
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-lg flex-shrink-0`}
                    >
                      <item.icon className="h-6 w-6 text-white" />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground mb-1 text-sm sm:text-base group-hover:text-gradient transition-all duration-300">
                        {item.title}
                      </h3>
                      <p className="font-semibold text-foreground text-sm sm:text-base">
                        {item.primary}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {item.secondary}
                      </p>
                      {item.extra && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.extra}
                        </p>
                      )}
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant}
                          className="mt-2 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
