"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Target, Heart, Award, Lightbulb, Users } from "lucide-react";

export default function About() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative py-16 sm:py-20 lg:py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-muted/20" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <div className="max-w-[1800px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Image Section - Left */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative group">
              {/* Floating decorative elements */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-2xl"
              />
              <motion.div
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl blur-2xl"
              />

              <Card className="overflow-hidden shadow-soft-xl border-2 border-border/50 backdrop-blur-sm bg-card/80 hover-lift group-hover:shadow-glow transition-all duration-500">
                <CardContent className="p-0 relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 via-accent/5 to-muted/10 flex items-center justify-center relative overflow-hidden">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-dots-pattern opacity-20" />

                    <div className="text-center space-y-4 sm:space-y-6 relative z-10 p-6 sm:p-8">
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-primary via-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-glow"
                      >
                        <Users className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />
                      </motion.div>
                      <div>
                        <p className="text-base sm:text-lg font-bold text-foreground mb-2">
                          Our Dedicated Care Team
                        </p>
                        <p className="text-sm sm:text-base text-muted-foreground">
                          Committed to your independence
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Content - Right */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8 lg:space-y-10 order-1 lg:order-2"
          >
            <div className="space-y-4 sm:space-y-6">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge
                  variant="glass"
                  className="w-fit text-sm sm:text-base px-4 py-2"
                >
                  About EverKind
                </Badge>
              </motion.div>
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight"
              >
                <span className="block">Empowering</span>
                <span className="block mt-2 text-gradient-animate">
                  Independence
                </span>
                <span className="block mt-2">Through Care</span>
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                viewport={{ once: true }}
                className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed"
              >
                At EverKind Community Support, we believe every individual
                deserves the opportunity to live with{" "}
                <span className="font-semibold text-foreground">
                  dignity, independence, and purpose
                </span>
                . Our dedicated team provides comprehensive support services
                tailored to meet the unique needs of each person we serve.
              </motion.p>
            </div>

            {/* Mission Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              viewport={{ once: true }}
            >
              <Card className="border-border/50 shadow-soft-lg bg-card/80 backdrop-blur-sm hover-lift">
                <CardContent className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      Our Mission
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    To provide exceptional community support services that
                    enhance quality of life and promote independence for
                    individuals and families.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Values Grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                Our Values
                <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: Heart,
                    title: "Compassion",
                    description:
                      "Caring for each person with empathy and understanding",
                    delay: 0,
                  },
                  {
                    icon: Award,
                    title: "Respect",
                    description: "Honoring dignity and individual choices",
                    delay: 0.1,
                  },
                  {
                    icon: Award,
                    title: "Excellence",
                    description: "Committed to the highest standards of care",
                    delay: 0.2,
                  },
                  {
                    icon: Lightbulb,
                    title: "Innovation",
                    description: "Continuously improving our services",
                    delay: 0.3,
                  },
                ].map((value) => (
                  <motion.div
                    key={value.title}
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 + value.delay }}
                    viewport={{ once: true }}
                    className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-card/50 to-card/30 border border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shrink-0">
                        <value.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="font-bold text-foreground">
                          {value.title}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {value.description}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
