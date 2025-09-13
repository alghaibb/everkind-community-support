"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactInfo() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Contact Information
          </h2>
          <p className="text-muted-foreground">
            Multiple ways to reach our support team
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-lg mb-3">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                  <p className="font-medium text-foreground mb-1">(03) 1234 5678</p>
                  <p className="text-sm text-muted-foreground mb-2">Mon-Fri: 9AM-5PM</p>
                  <Badge variant="secondary">Preferred Contact</Badge>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-lg mb-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <p className="font-medium text-foreground mb-1">info@everkind.org.au</p>
                  <p className="text-sm text-muted-foreground mb-2">Response within 24 hours</p>
                  <Badge variant="outline">Business Hours</Badge>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-lg mb-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Office</h3>
                  <p className="font-medium text-foreground mb-1">123 Community Street</p>
                  <p className="text-sm text-muted-foreground mb-1">Melbourne VIC 3000</p>
                  <p className="text-sm text-muted-foreground">Wheelchair accessible</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-lg mb-3">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Hours</h3>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Mon-Fri</p>
                    <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</p>
                    <p className="font-medium text-foreground">Sat-Sun</p>
                    <p className="text-sm text-muted-foreground">Emergency Only</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
