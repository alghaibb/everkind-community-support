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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-md h-full">
              <CardHeader className="text-center pb-2">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-2">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Phone</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-semibold text-foreground mb-1">
                  (03) 1234 5678
                </p>
                <p className="text-sm text-muted-foreground">
                  Mon-Fri: 9AM-5PM
                </p>
                <Badge variant="secondary" className="mt-2">
                  Preferred Contact
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-md h-full">
              <CardHeader className="text-center pb-2">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-2">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Email</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-semibold text-foreground mb-1">
                  info@everkind.org.au
                </p>
                <p className="text-sm text-muted-foreground">
                  Response within 24 hours
                </p>
                <Badge variant="outline" className="mt-2">
                  Business Hours
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-md h-full">
              <CardHeader className="text-center pb-2">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-2">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Office</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="font-semibold text-foreground mb-1">
                  123 Community Street
                </p>
                <p className="text-sm text-muted-foreground mb-1">
                  Melbourne VIC 3000
                </p>
                <p className="text-sm text-muted-foreground">
                  Wheelchair accessible
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-md h-full">
              <CardHeader className="text-center pb-2">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-2">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Hours</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Mon-Fri</p>
                  <p className="text-sm text-muted-foreground">9:00 AM - 5:00 PM</p>
                  <p className="font-semibold text-foreground">Sat-Sun</p>
                  <p className="text-sm text-muted-foreground">Emergency Only</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
