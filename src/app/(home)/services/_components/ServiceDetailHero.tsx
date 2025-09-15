"use client";

import { motion } from "framer-motion";

interface ServiceDetailHeroProps {
  title: string;
  subtitle: string;
  description: string;
}

export default function ServiceDetailHero({
  title,
  subtitle,
  description,
}: ServiceDetailHeroProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {title}
          </h1>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            {subtitle}
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
