"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { footerServicesSection } from "../constants";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Services() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative py-16 sm:py-20 lg:py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-accent/10" />
      <div className="absolute inset-0 bg-dots-pattern opacity-30" />

      <div className="max-w-[1800px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-16 lg:mb-20"
        >
          <Badge
            variant="glass"
            className="w-fit mx-auto text-sm sm:text-base px-4 py-2"
          >
            Our Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            <span className="block text-gradient-animate">Comprehensive</span>
            <span className="block mt-2">Support Services</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We provide a full range of{" "}
            <span className="font-semibold text-foreground">
              community support services
            </span>{" "}
            designed to help individuals live independently and participate
            fully in their communities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {footerServicesSection.map((service, index) => (
            <motion.div
              key={service.href}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full border-border/50 shadow-soft-lg hover:shadow-glow transition-all duration-500 hover:-translate-y-2 bg-card/90 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors shrink-0"
                    >
                      <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                    </motion.div>
                    <Badge variant="success" className="text-xs shrink-0">
                      #{(index + 1).toString().padStart(2, "0")}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold group-hover:text-gradient transition-all">
                    {service.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Professional support services for{" "}
                    <span className="font-semibold text-foreground">
                      {service.label.toLowerCase()}
                    </span>{" "}
                    designed to enhance independence and quality of life.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full group/btn hover:bg-primary hover:text-primary-foreground"
                    asChild
                  >
                    <Link
                      href={service.href}
                      className="flex items-center justify-center gap-2"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
