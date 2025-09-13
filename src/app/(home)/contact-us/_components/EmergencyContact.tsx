"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Phone } from "lucide-react";

export default function EmergencyContact() {
  return (
    <section className="py-16 bg-red-50 dark:bg-red-950/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 text-red-600 dark:text-red-400 mb-4">
            <AlertTriangle className="h-6 w-6" />
            <span className="font-semibold">Emergency Support</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            24/7 Emergency Support Available
          </h2>
          <p className="text-muted-foreground">
            For urgent situations or emergencies, contact these services
            immediately.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Phone className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Emergency Hotline
                  </h3>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                    000
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For life-threatening emergencies
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Phone className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Crisis Support
                  </h3>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                    13 11 14
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Lifeline 24/7 crisis support
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
