"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Clock, Star } from "lucide-react";

export default function AboutStats() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    {
      icon: Users,
      number: 500,
      suffix: "+",
      label: "Clients Supported",
      description: "Individuals and families we've helped",
    },
    {
      icon: MapPin,
      number: 15,
      suffix: "+",
      label: "Service Areas",
      description: "Across Melbourne and surrounds",
    },
    {
      icon: Clock,
      number: 5,
      suffix: "+",
      label: "Years Experience",
      description: "Providing quality NDIS services",
    },
    {
      icon: Star,
      number: 98,
      suffix: "%",
      label: "Client Satisfaction",
      description: "Based on feedback surveys",
    },
  ];

  const AnimatedNumber = ({
    number,
    suffix,
  }: {
    number: number;
    suffix: string;
  }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!mounted) return;

      const timer = setTimeout(() => {
        const increment = number / 50;
        const interval = setInterval(() => {
          setCount((prev) => {
            const next = prev + increment;
            if (next >= number) {
              clearInterval(interval);
              return number;
            }
            return next;
          });
        }, 30);

        return () => clearInterval(interval);
      }, 500);

      return () => clearTimeout(timer);
    }, [number]);

    return (
      <span>
        {Math.floor(count)}
        {suffix}
      </span>
    );
  };

  if (!mounted) {
    return (
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Impact
            </h2>
            <p className="text-muted-foreground">
              The numbers that reflect our commitment to the community.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

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
            Our Impact
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="block">Making a</span>
            <span className="block mt-2 text-gradient-animate">Difference</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The numbers that reflect our commitment to the community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 sm:p-8 rounded-3xl glass-light hover:glass transition-all duration-300 hover-lift"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center border border-primary/20"
              >
                <stat.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </motion.div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-gradient mb-2">
                <AnimatedNumber number={stat.number} suffix={stat.suffix} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">
                {stat.label}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
