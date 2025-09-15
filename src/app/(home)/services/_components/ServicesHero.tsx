"use client";

import { motion } from "framer-motion";

export default function ServicesHero() {
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
            Our Services
          </h1>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Comprehensive NDIS Support
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            We provide a full range of NDIS support services designed to help
            you live independently, participate in your community, and achieve
            your personal goals.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
