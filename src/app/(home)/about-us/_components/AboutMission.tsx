"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Heart, Users } from "lucide-react";

export default function AboutMission() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/10 to-accent/5" />

      <div className="max-w-[1800px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 space-y-4 sm:space-y-6"
        >
          <Badge
            variant="glass"
            className="w-fit mx-auto text-sm sm:text-base px-4 py-2"
          >
            Mission & Vision
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="block">What Drives</span>
            <span className="block mt-2 text-gradient-animate">
              Our Purpose
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            The core principles that guide us every day to provide exceptional
            care and support.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {[
            {
              icon: Target,
              title: "Our Mission",
              description:
                "To provide high-quality, person-centered support services that empower individuals with disabilities to achieve their goals and live independently in their communities.",
              delay: 0,
            },
            {
              icon: Heart,
              title: "Our Vision",
              description:
                "A world where every person with a disability has the opportunity to participate fully in community life, with dignity, respect, and genuine choice and control.",
              delay: 0.1,
            },
            {
              icon: Users,
              title: "Our Approach",
              description:
                "We believe in building genuine relationships, understanding individual needs, and working collaboratively to create meaningful outcomes for every person we support.",
              delay: 0.2,
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + item.delay }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border/50 shadow-soft-lg hover:shadow-glow transition-all duration-500 bg-card/90 backdrop-blur-sm hover-lift group">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 group-hover:border-primary/40 transition-colors"
                    >
                      <item.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    </motion.div>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold group-hover:text-gradient transition-all">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {item.description}
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
