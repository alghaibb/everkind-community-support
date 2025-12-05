"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Calendar, MapPin } from "lucide-react";

export default function ServiceAreas() {
  const areas = [
    {
      icon: Building,
      title: "Melbourne Metro",
      description:
        "City of Melbourne, surrounding suburbs, and metropolitan area",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Users,
      title: "Regional Victoria",
      description: "Geelong, Ballarat, Bendigo, and regional centers",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Calendar,
      title: "Extended Services",
      description: "Available for assessments and consultations statewide",
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 space-y-4"
        >
          <Badge variant="glass" className="gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Where We Serve
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Service <span className="text-gradient-animate">Areas</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            We provide comprehensive community support services across{" "}
            <strong>Victoria</strong>
          </p>
        </motion.div>

        {/* Area Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {areas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full border-border/50 shadow-soft-lg hover:shadow-glow transition-all duration-500 hover:-translate-y-2 bg-card/90 backdrop-blur-sm text-center">
                <CardContent className="p-6 sm:p-8 space-y-4">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br ${area.color} shadow-lg`}
                  >
                    <area.icon className="h-8 w-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-gradient transition-all duration-300">
                    {area.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {area.description}
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
