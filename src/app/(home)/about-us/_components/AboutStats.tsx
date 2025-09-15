"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
    }, [number, mounted]);

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
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Our Impact
          </h2>
          <p className="text-muted-foreground">
            The numbers that reflect our commitment to the community.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                <AnimatedNumber number={stat.number} suffix={stat.suffix} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {stat.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
