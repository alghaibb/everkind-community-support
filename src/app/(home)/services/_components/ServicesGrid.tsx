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
  CheckCircle2,
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
      color: "from-rose-500 to-pink-600",
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
      color: "from-blue-500 to-cyan-600",
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
      color: "from-emerald-500 to-teal-600",
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
      color: "from-amber-500 to-orange-600",
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
      color: "from-violet-500 to-purple-600",
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
      color: "from-sky-500 to-indigo-600",
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
      color: "from-green-500 to-emerald-600",
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
      color: "from-fuchsia-500 to-pink-600",
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
      color: "from-red-500 to-rose-600",
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute inset-0 bg-dots-pattern opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 space-y-4"
        >
          <Badge variant="glass" className="gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Explore Our Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            What We <span className="text-gradient-animate">Offer</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Explore our comprehensive range of{" "}
            <strong>NDIS support services</strong>.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full border-border/50 shadow-soft-lg hover:shadow-glow transition-all duration-500 hover:-translate-y-2 bg-card/90 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} shadow-lg`}
                    >
                      <service.icon className="h-7 w-7 text-white" />
                    </motion.div>
                    <Badge variant="secondary" className="text-xs">
                      {service.availability}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg sm:text-xl group-hover:text-gradient transition-all duration-300">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2.5">
                    <h4 className="text-sm font-semibold text-foreground">
                      Key Features:
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1.5">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color} flex-shrink-0`}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Button */}
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full group/btn hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <Link href={`/services/${service.slug}`}>
                      Learn About {service.title}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
