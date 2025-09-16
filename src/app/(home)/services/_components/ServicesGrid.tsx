"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Heart,
  Users,
  Home,
  Car,
  Stethoscope,
  UserPlus,
  Coffee,
  GraduationCap,
  Briefcase,
  ArrowRight,
} from "lucide-react";

export default function ServicesGrid() {
  const services = [
    {
      slug: "personal-activities",
      title: "Personal Activities",
      description:
        "Assistance with daily living activities including personal hygiene, medication support, and health monitoring.",
      icon: Heart,
      features: [
        "Personal Hygiene",
        "Medication Management",
        "Health Monitoring",
        "Mobility Support",
      ],
      availability: "24/7 Available",
    },
    {
      slug: "travel-transport",
      title: "Travel & Transport",
      description:
        "Safe and reliable transport to appointments, social activities, and community events.",
      icon: Car,
      features: [
        "Medical Appointments",
        "Social Outings",
        "Shopping Trips",
        "Community Events",
      ],
      availability: "On-Demand",
    },
    {
      slug: "nursing-care",
      title: "Nursing Care",
      description:
        "Professional nursing services including wound care, medication administration, and health assessments.",
      icon: Stethoscope,
      features: [
        "Wound Care",
        "Medication Admin",
        "Health Assessments",
        "Clinical Support",
      ],
      availability: "Registered Nurses",
    },
    {
      slug: "daily-tasks",
      title: "Daily Tasks",
      description:
        "Help with daily activities and routines to maintain independence and quality of life.",
      icon: Users,
      features: [
        "Daily Routines",
        "Task Management",
        "Skill Building",
        "Independence Support",
      ],
      availability: "Flexible Hours",
    },
    {
      slug: "life-skills",
      title: "Life Skills",
      description:
        "Training programs to build independence, confidence, and practical daily living abilities.",
      icon: GraduationCap,
      features: [
        "Daily Living Skills",
        "Communication Skills",
        "Social Skills",
        "Problem Solving",
      ],
      availability: "Structured Programs",
    },
    {
      slug: "household-tasks",
      title: "Household Tasks",
      description:
        "Help with domestic activities to maintain a clean, safe, and comfortable living environment.",
      icon: Home,
      features: [
        "Cleaning Services",
        "Meal Preparation",
        "Laundry",
        "Home Maintenance",
      ],
      availability: "Scheduled Visits",
    },
    {
      slug: "community-participation",
      title: "Community Participation",
      description:
        "Support to participate in community activities, social events, and recreational programs.",
      icon: UserPlus,
      features: [
        "Social Activities",
        "Recreation Programs",
        "Community Events",
        "Skill Building",
      ],
      availability: "Group & Individual",
    },
    {
      slug: "therapeutic-supports",
      title: "Therapeutic Supports",
      description:
        "Allied health and therapeutic services to support your health and wellbeing goals.",
      icon: Coffee,
      features: [
        "Allied Health",
        "Therapy Sessions",
        "Rehabilitation",
        "Wellness Programs",
      ],
      availability: "Professional Staff",
    },
    {
      slug: "group-activities",
      title: "Group Activities",
      description:
        "Structured group programs and activities to build social connections and develop skills.",
      icon: Briefcase,
      features: [
        "Social Groups",
        "Skill Development",
        "Peer Support",
        "Recreational Activities",
      ],
      availability: "Scheduled Groups",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            What We Offer
          </h2>
          <p className="text-muted-foreground">
            Explore our comprehensive range of NDIS support services.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-md h-full hover:shadow-lg transition-shadow duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {service.availability}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">
                      Key Features:
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Link href={`/services/${service.slug}`}>
                        Learn About {service.title}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
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
