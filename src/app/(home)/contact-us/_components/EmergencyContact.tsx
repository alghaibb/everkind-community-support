"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Phone, HeartPulse } from "lucide-react";

export default function EmergencyContact() {
  const emergencyContacts = [
    {
      title: "Emergency Hotline",
      number: "000",
      description: "For life-threatening emergencies",
      icon: Phone,
    },
    {
      title: "Crisis Support",
      number: "13 11 14",
      description: "Lifeline 24/7 crisis support",
      icon: HeartPulse,
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-red-50/50 to-background dark:from-red-950/30 dark:via-red-950/20 dark:to-background" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 space-y-4"
        >
          <Badge variant="destructive" className="gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            Emergency Support
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            24/7 Emergency Support{" "}
            <span className="text-red-600 dark:text-red-400">Available</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            For urgent situations or emergencies, contact these services
            immediately
          </p>
        </motion.div>

        {/* Emergency Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {emergencyContacts.map((contact, index) => (
            <motion.div
              key={contact.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-red-200 dark:border-red-800/50 shadow-soft-lg hover:shadow-red-500/20 transition-all duration-300 bg-card/95 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700 shadow-lg flex-shrink-0"
                    >
                      <contact.icon className="h-7 w-7 text-white" />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-base sm:text-lg mb-2">
                        {contact.title}
                      </h3>
                      <p className="text-3xl sm:text-4xl font-black text-red-600 dark:text-red-400 mb-2">
                        {contact.number}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contact.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
