"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function About() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-20 bg-gradient-to-br from-background via-muted/20 to-accent/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Placeholder - Left */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <Card className="overflow-hidden shadow-xl">
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-muted/30 to-muted/60 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-muted-foreground font-medium">
                      Image will be here
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Our dedicated care team
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content - Right */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8 order-1 lg:order-2"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge variant="secondary" className="w-fit">
                  About EverKind
                </Badge>
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-foreground"
              >
                Empowering Independence Through Compassionate Care
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                viewport={{ once: true }}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                At EverKind Community Support, we believe every individual
                deserves the opportunity to live with dignity, independence, and
                purpose. Our dedicated team provides comprehensive support
                services tailored to meet the unique needs of each person we
                serve.
              </motion.p>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-foreground">
                  Our Mission
                </h3>
                <p className="text-muted-foreground">
                  To provide exceptional community support services that enhance
                  quality of life and promote independence for individuals and
                  families.
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold text-foreground">
                  Our Values
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="font-medium text-foreground">
                      Compassion
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Caring for each person with empathy and understanding
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-foreground">Respect</div>
                    <div className="text-sm text-muted-foreground">
                      Honoring dignity and individual choices
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-foreground">
                      Excellence
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Committed to the highest standards of care
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-foreground">
                      Innovation
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Continuously improving our services
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
