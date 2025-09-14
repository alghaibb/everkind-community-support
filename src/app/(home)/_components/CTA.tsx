"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-20 bg-gradient-to-br from-primary via-primary/90 to-accent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="border-0 shadow-2xl bg-background">
            <CardContent className="p-12 text-center">
              <div className="space-y-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Ready to Get Started?
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    Our experienced team is here to help you understand which
                    services best meet your needs and goals. Contact us today to
                    begin your journey toward greater independence and community
                    participation.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button size="lg" className="px-8 py-6 text-lg" asChild>
                    <Link href="/contact-us">Contact Our Team</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg"
                    asChild
                  >
                    <Link href="/services">View All Services</Link>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="pt-8 border-t border-border"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        24/7
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Support Available
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        Free
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Initial Consultation
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        Same Day
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Response Guaranteed
                      </div>
                    </div>
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
