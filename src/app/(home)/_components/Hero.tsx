"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart } from "lucide-react";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh-gradient"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-[1800px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 sm:space-y-8 lg:space-y-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Trusted NDIS Provider
              </span>
            </motion.div>

            <div className="space-y-4 sm:space-y-6">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight"
              >
                <span className="block text-gradient-animate">
                  Compassionate
                </span>
                <span className="block mt-2">Care for</span>
                <span className="mt-2 flex items-center gap-3 sm:gap-4">
                  <Heart className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-primary animate-float" />
                  <span className="text-gradient">Every</span>
                </span>
                <span className="block mt-2">Community</span>
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl"
              >
                Professional, person-centered care services that{" "}
                <span className="font-semibold text-foreground">
                  empower individuals
                </span>{" "}
                to live independently and thrive in their communities.
              </motion.p>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Button
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 group shadow-glow hover:shadow-glow-lg"
                asChild
              >
                <Link href="/contact-us" className="flex items-center gap-2">
                  Get Started Today
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="glass"
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7"
                asChild
              >
                <Link href="/about-us">Learn About EverKind</Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-6 sm:pt-8"
            >
              {[
                { value: "500+", label: "Clients Served", delay: 0 },
                { value: "9", label: "Services Offered", delay: 0.1 },
                { value: "24/7", label: "Support Available", delay: 0.2 },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.0 + stat.delay }}
                  className="text-center p-3 sm:p-4 rounded-2xl glass-light hover:glass transition-all duration-300 hover-lift"
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative group">
              {/* Floating decorative elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary to-primary/50 rounded-3xl blur-xl opacity-50"
              />
              <motion.div
                animate={{
                  y: [0, 20, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-accent to-accent/50 rounded-3xl blur-xl opacity-50"
              />

              <Card className="overflow-hidden shadow-soft-xl border-2 border-border/50 backdrop-blur-sm bg-card/80 hover-lift group-hover:shadow-glow transition-all duration-500">
                <CardContent className="p-0 relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 via-accent/5 to-muted/10 flex items-center justify-center relative overflow-hidden">
                    {/* Animated grid background */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-20" />

                    <div className="text-center space-y-4 sm:space-y-6 relative z-10 p-6 sm:p-8">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-primary via-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-glow"
                      >
                        <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
                      </motion.div>
                      <div>
                        <p className="text-base sm:text-lg font-bold text-foreground mb-2">
                          Professional Care Team
                        </p>
                        <p className="text-sm sm:text-base text-muted-foreground">
                          Dedicated to your wellbeing
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
