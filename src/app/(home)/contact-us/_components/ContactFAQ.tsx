"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Sparkles } from "lucide-react";

export default function ContactFAQ() {
  const faqs = [
    {
      id: "services",
      question: "What services do you provide?",
      answer:
        "We provide comprehensive community support services including personal activities assistance, travel and transport support, community nursing care, daily life tasks, therapeutic supports, and participation in community activities.",
    },
    {
      id: "eligibility",
      question: "Who is eligible for your services?",
      answer:
        "Our services are available to individuals who require support with daily living activities. Eligibility is determined through an assessment process that considers individual needs and circumstances.",
    },
    {
      id: "referral",
      question: "How do I get referred for services?",
      answer:
        "You can contact us directly for an initial assessment, or you may be referred by healthcare professionals, family members, or other support services. We'll guide you through the assessment process.",
    },
    {
      id: "costs",
      question: "Are your services free?",
      answer:
        "Service costs vary depending on individual circumstances and funding arrangements. We work with various funding sources including NDIS, My Aged Care, and private funding. Contact us for a detailed assessment of costs and available funding options.",
    },
    {
      id: "response-time",
      question: "How quickly can you respond to inquiries?",
      answer:
        "We aim to respond to all inquiries within 24 hours during business days. For urgent situations requiring immediate support, please call our emergency hotline. Assessment appointments are typically scheduled within 1-2 weeks.",
    },
    {
      id: "confidentiality",
      question: "How do you protect my privacy and confidentiality?",
      answer:
        "We are committed to protecting your privacy and maintaining confidentiality. All information is handled in accordance with privacy policies and data protection regulations. Your personal information is securely stored and only shared with your consent or as required by law.",
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      <div className="absolute inset-0 bg-dots-pattern opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 space-y-4"
        >
          <Badge variant="glass" className="gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" />
            Common Questions
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Frequently Asked{" "}
            <span className="text-gradient-animate">Questions</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Quick answers to common questions about our services
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <AccordionItem
                  value={faq.id}
                  className="border border-border/50 rounded-2xl px-6 bg-card/80 backdrop-blur-sm shadow-soft-sm hover:shadow-soft-lg transition-all duration-300"
                >
                  <AccordionTrigger className="text-left py-5 hover:no-underline group">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-sm sm:text-base group-hover:text-gradient transition-all duration-300">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 pl-11 text-sm sm:text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
