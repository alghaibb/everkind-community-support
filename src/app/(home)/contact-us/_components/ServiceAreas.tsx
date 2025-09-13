"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Calendar } from "lucide-react";

export default function ServiceAreas() {
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
            Service Areas
          </h2>
          <p className="text-muted-foreground">
            We provide comprehensive community support services across
            Victoria.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Melbourne Metro
              </h3>
              <p className="text-sm text-muted-foreground">
                City of Melbourne, surrounding suburbs, and metropolitan area
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Regional Victoria
              </h3>
              <p className="text-sm text-muted-foreground">
                Geelong, Ballarat, Bendigo, and regional centers
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Extended Services
              </h3>
              <p className="text-sm text-muted-foreground">
                Available for assessments and consultations statewide
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
