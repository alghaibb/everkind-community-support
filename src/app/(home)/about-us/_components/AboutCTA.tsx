"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, MessageCircle, Briefcase, Sparkles } from "lucide-react";

export default function AboutCTA() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Dramatic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-muted/20" />
      <div className="absolute inset-0 bg-dots-pattern opacity-30" />

      {/* Animated orbs */}
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="border-border/50 shadow-soft-xl bg-card/95 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-8 sm:p-12 lg:p-16 space-y-8 sm:space-y-10">
              {/* Header */}
              <div className="space-y-4 sm:space-y-6">
                <Badge
                  variant="glass"
                  className="w-fit mx-auto text-sm sm:text-base px-4 py-2"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Take Action
                </Badge>

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                  <span className="block">Ready to</span>
                  <span className="block mt-2 text-gradient-animate">
                    Get Started?
                  </span>
                </h2>

                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Whether you&apos;re looking for{" "}
                  <span className="font-semibold text-foreground">
                    support services
                  </span>{" "}
                  or want to{" "}
                  <span className="font-semibold text-foreground">
                    join our team
                  </span>
                  , we&apos;re here to help you take the next step.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="min-w-[220px] px-8 py-7 text-lg group shadow-glow hover:shadow-glow-lg"
                  >
                    <Link
                      href="/contact-us"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Get Support Today
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="min-w-[220px] px-8 py-7 text-lg border-2 hover:bg-foreground hover:text-background"
                  >
                    <Link href="/careers" className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Join Our Team
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
