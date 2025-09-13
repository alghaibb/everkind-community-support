"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Building } from "lucide-react";

export default function AdditionalContact() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Additional Ways to Connect
          </h2>
          <p className="text-muted-foreground">
            Beyond our contact form, here are other ways to get in touch.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Schedule a Consultation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Book a free initial consultation to discuss your needs and
                explore our available services.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Duration:</strong> 30-45 minutes
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Format:</strong> In-person, phone, or video call
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Cost:</strong> Free of charge
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-primary" />
                <span>Visit Our Office</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Come visit us at our Melbourne office for in-person
                consultations and support services.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Address:</strong> 123 Community Street, Melbourne
                  VIC 3000
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Parking:</strong> Available on-site
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Accessibility:</strong> Wheelchair accessible
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
