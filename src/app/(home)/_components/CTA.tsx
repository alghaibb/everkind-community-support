"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  Clock,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export default function CTA() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative py-16 sm:py-20 lg:py-28 overflow-hidden"
    >
      {/* Dramatic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-accent" />
      <div className="absolute inset-0 bg-mesh-gradient opacity-30" />

      {/* Animated elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="border-0 shadow-2xl bg-background/98 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-8 sm:p-12 lg:p-16 text-center">
              <div className="space-y-8 sm:space-y-10 lg:space-y-12">
                {/* Header */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">
                      Start Your Journey Today
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                    <span className="block">Ready to</span>
                    <span className="block mt-2 text-gradient-animate">
                      Get Started?
                    </span>
                  </h2>
                  <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    Our{" "}
                    <span className="font-semibold text-foreground">
                      experienced team
                    </span>{" "}
                    is here to help you understand which services best meet your
                    needs and goals. Contact us today to begin your journey
                    toward greater independence and community participation.
                  </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
                >
                  <Button
                    size="lg"
                    className="px-6 sm:px-8 py-6 sm:py-7 text-base sm:text-lg group shadow-glow hover:shadow-glow-lg"
                    asChild
                  >
                    <Link
                      href="/contact-us"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Contact Our Team
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-6 sm:px-8 py-6 sm:py-7 text-base sm:text-lg border-2 hover:bg-foreground hover:text-background"
                    asChild
                  >
                    <Link href="/services" className="flex items-center gap-2">
                      View All Services
                    </Link>
                  </Button>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="pt-8 border-t border-border/50"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                    {[
                      {
                        icon: Clock,
                        value: "24/7",
                        label: "Support Available",
                        delay: 0,
                      },
                      {
                        icon: Phone,
                        value: "Free",
                        label: "Initial Consultation",
                        delay: 0.1,
                      },
                      {
                        icon: MessageCircle,
                        value: "Same Day",
                        label: "Response Guaranteed",
                        delay: 0.2,
                      },
                    ].map((feature) => (
                      <motion.div
                        key={feature.label}
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.8 + feature.delay,
                        }}
                        viewport={{ once: true }}
                        className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-border/30 hover:border-primary/30 transition-all duration-300 hover-lift"
                      >
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 mb-3">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-gradient mb-1">
                          {feature.value}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-muted-foreground">
                          {feature.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}
