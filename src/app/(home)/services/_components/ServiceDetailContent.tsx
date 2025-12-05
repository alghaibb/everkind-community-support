"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Sparkles } from "lucide-react";

interface Feature {
  title: string;
  description: string;
}

interface ServiceDetailContentProps {
  features: Feature[];
  benefits: string[];
}

export default function ServiceDetailContent({
  features,
  benefits,
}: ServiceDetailContentProps) {
  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 sm:mb-20"
        >
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14 space-y-4">
            <Badge variant="glass" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Service Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              What&apos;s{" "}
              <span className="text-gradient-animate">Included</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Comprehensive support tailored to your{" "}
              <strong>individual needs</strong>.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full border-border/50 shadow-soft-lg hover:shadow-glow transition-all duration-500 hover:-translate-y-1 bg-card/90 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md"
                      >
                        <Star className="h-5 w-5 text-primary-foreground" />
                      </motion.div>
                      <span className="group-hover:text-gradient transition-all duration-300">
                        {feature.title}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="rounded-3xl glass-light p-8 sm:p-10 lg:p-14">
            {/* Header */}
            <div className="text-center mb-10 space-y-4">
              <Badge variant="success" className="gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                Why Choose Us
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Key <span className="text-gradient-animate">Benefits</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
                How our service makes a difference in your{" "}
                <strong>daily life</strong>.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-colors duration-300"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-foreground text-sm sm:text-base">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
