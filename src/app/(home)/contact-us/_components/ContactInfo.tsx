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
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 text-sm">
                      Phone
                    </h3>
                    <p className="font-medium text-foreground mb-1 text-sm">
                      (03) 1234 5678
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      Mon-Fri: 9AM-5PM
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Preferred Contact
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 text-sm">
                      Email
                    </h3>
                    <p className="font-medium text-foreground mb-1 text-sm">
                      info@ekcs.com.au
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      Response within 24 hours
                    </p>
                    <Badge variant="outline" className="text-xs">
                      Business Hours
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 text-sm">
                      Office
                    </h3>
                    <p className="font-medium text-foreground mb-1 text-sm">
                      123 Community Street
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      Melbourne VIC 3000
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Wheelchair accessible
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 text-sm">
                      Hours
                    </h3>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground text-sm">
                        Mon-Fri: 9:00 AM - 5:00 PM
                      </p>
                      <p className="font-medium text-foreground text-sm">
                        Sat-Sun: Emergency Only
                      </p>
                    </div>
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
