"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
    },
    {
      icon: Handshake,
      title: "Respect",
      description:
        "We honor the dignity, rights, and choices of every individual we support.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We strive for the highest standards in service delivery and professional practice.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We embrace new ideas and approaches to improve outcomes for our clients.",
    },
    {
      icon: Globe,
      title: "Inclusion",
      description:
        "We promote diversity and ensure everyone feels valued and included.",
    },
    {
      icon: CheckCircle,
      title: "Empowerment",
      description:
        "We support individuals to build skills, confidence, and independence.",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Our Core Values
          </h2>
          <p className="text-muted-foreground">
            The principles that guide everything we do and every decision we
            make.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-md h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
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
