"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ContactFAQ() {
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
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Quick answers to common questions about our services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="services" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                What services do you provide?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We provide comprehensive community support services including
                personal activities assistance, travel and transport support,
                community nursing care, daily life tasks, therapeutic supports,
                and participation in community activities.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="eligibility"
              className="border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left">
                Who is eligible for your services?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our services are available to individuals who require support
                with daily living activities. Eligibility is determined through
                an assessment process that considers individual needs and
                circumstances.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="referral" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                How do I get referred for services?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You can contact us directly for an initial assessment, or you
                may be referred by healthcare professionals, family members, or
                other support services. We&apos;ll guide you through the
                assessment process.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="costs" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Are your services free?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Service costs vary depending on individual circumstances and
                funding arrangements. We work with various funding sources
                including NDIS, My Aged Care, and private funding. Contact us
                for a detailed assessment of costs and available funding
                options.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="response-time"
              className="border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left">
                How quickly can you respond to inquiries?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We aim to respond to all inquiries within 24 hours during
                business days. For urgent situations requiring immediate
                support, please call our emergency hotline. Assessment
                appointments are typically scheduled within 1-2 weeks.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="confidentiality"
              className="border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left">
                How do you protect my privacy and confidentiality?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We are committed to protecting your privacy and maintaining
                confidentiality. All information is handled in accordance with
                privacy policies and data protection regulations. Your personal
                information is securely stored and only shared with your consent
                or as required by law.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
