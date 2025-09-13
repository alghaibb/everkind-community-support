"use client";

import { motion } from "framer-motion";

export default function ContactHero() {
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
            Get in Touch
          </h1>
          <h2 className="text-2xl font-semibold text-primary mb-4">
            We're Here to Help
          </h2>
          <p className="text-muted-foreground">
            We're available to help you navigate your community support needs.
            Reach out to us through any of the channels below.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
