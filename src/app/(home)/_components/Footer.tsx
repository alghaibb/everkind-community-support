"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  footerDescription,
  footerLinks,
  footerServicesSection,
  copyrightText,
} from "../constants";
import { motion } from "framer-motion";
import { Heart, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-muted/30 via-background to-primary/5 border-t border-border/50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-dots-pattern opacity-20" />

      {/* Gradient Orb */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-[1800px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-6"
            >
              <Link href="/" className="inline-block group">
                <div className="relative">
                  <Image
                    src="/ekcs-logo.png"
                    alt="EverKind Community Support"
                    width={180}
                    height={180}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>

              <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                {footerDescription}
              </p>

              {/* Contact Info Cards */}
              <div className="space-y-3">
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Call Us</div>
                    <div className="text-sm font-semibold">1800 123 456</div>
                  </div>
                </a>

                <a
                  href="mailto:info@everkind.com.au"
                  className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Email Us
                    </div>
                    <div className="text-sm font-semibold">
                      info@everkind.com.au
                    </div>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                Quick Links
                <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
              </h3>
              <ul className="space-y-3">
                {footerLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                    >
                      <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                Our Services
                <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {footerServicesSection.slice(0, 6).map((service, index) => (
                  <motion.li
                    key={service.href}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={service.href}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
                    >
                      <ArrowRight className="h-4 w-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">
                        {service.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-border/50 py-6 sm:py-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-primary animate-pulse" />
              <span>by EverKind</span>
            </div>

            <p className="text-sm text-muted-foreground text-center sm:text-right">
              {copyrightText}
            </p>

            <Badge variant="glass" className="text-xs">
              NDIS Registered Provider
            </Badge>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
