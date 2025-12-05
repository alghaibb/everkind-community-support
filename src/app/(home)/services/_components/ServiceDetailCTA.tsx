"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MessageCircle, ArrowRight, Sparkles, LayoutGrid } from "lucide-react";

export default function ServiceDetailCTA() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-dots-pattern opacity-20" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 right-20 w-56 h-56 bg-primary/15 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="border-border/50 shadow-soft-xl bg-card/95 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-8 sm:p-12 lg:p-16 space-y-8">
              {/* Badge */}
              <Badge variant="glass" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Take the Next Step
              </Badge>

              {/* Headline */}
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  Interested in This{" "}
                  <span className="text-gradient-animate">Service?</span>
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
                  Contact us today to discuss your specific needs and learn how
                  we can provide the support that&apos;s{" "}
                  <strong>right for you</strong>.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="px-8 py-6 text-base sm:text-lg group shadow-glow hover:shadow-glow-lg"
                  >
                    <Link href="/contact-us">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Get in Touch
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-base sm:text-lg hover:bg-foreground hover:text-background transition-all duration-300"
                  >
                    <Link href="/services">
                      <LayoutGrid className="mr-2 h-5 w-5" />
                      View All Services
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
