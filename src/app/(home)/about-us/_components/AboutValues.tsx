"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Handshake,
  Award,
  Lightbulb,
  Globe,
  CheckCircle,
} from "lucide-react";

export default function AboutValues() {
  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description:
        "We act with honesty, transparency, and accountability in everything we do.",
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-600",
    },
    {
      icon: Handshake,
      title: "Respect",
      description:
        "We honor the dignity, rights, and choices of every individual we support.",
      color: "from-green-500/10 to-green-500/5",
      iconColor: "text-green-600",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We strive for the highest standards in service delivery and professional practice.",
      color: "from-amber-500/10 to-amber-500/5",
      iconColor: "text-amber-600",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We embrace new ideas and approaches to improve outcomes for our clients.",
      color: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-600",
    },
    {
      icon: Globe,
      title: "Inclusion",
      description:
        "We promote diversity and ensure everyone feels valued and included.",
      color: "from-pink-500/10 to-pink-500/5",
      iconColor: "text-pink-600",
    },
    {
      icon: CheckCircle,
      title: "Empowerment",
      description:
        "We support individuals to build skills, confidence, and independence.",
      color: "from-primary/10 to-primary/5",
      iconColor: "text-primary",
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-background to-primary/5" />
      <div className="absolute inset-0 bg-dots-pattern opacity-20" />

      <div className="max-w-[1800px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 space-y-4 sm:space-y-6"
        >
          <Badge
            variant="glass"
            className="w-fit mx-auto text-sm sm:text-base px-4 py-2"
          >
            Our Values
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="block">Principles That</span>
            <span className="block mt-2 text-gradient-animate">Guide Us</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The core values that shape everything we do and every decision we
            make.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border/50 shadow-soft-lg hover:shadow-glow transition-all duration-500 bg-card/90 backdrop-blur-sm hover-lift group">
                <CardContent className="p-6 sm:p-8 text-center space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center border border-border/30 group-hover:border-border/60 transition-colors`}
                  >
                    <value.icon
                      className={`h-8 w-8 sm:h-10 sm:w-10 ${value.iconColor}`}
                    />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
