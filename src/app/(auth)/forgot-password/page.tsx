"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, KeyRound, Sparkles, Mail, Shield, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  return (
    <div className="container relative min-h-screen flex flex-col lg:max-w-none lg:px-0">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10"
      >
        <Button asChild variant="glass" size="sm" className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </Button>
      </motion.div>

      <div className="flex-1 flex-col items-center justify-center grid lg:grid-cols-2 gap-0">
        {/* Left Panel - Decorative */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative hidden h-full flex-col p-8 lg:p-12 text-white lg:flex"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-800" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          
          {/* Floating elements */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity }}
          />

          {/* Brand */}
          <div className="relative z-20 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20">
              <KeyRound className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">EverKind Security</span>
          </div>

          {/* Features */}
          <div className="relative z-20 mt-auto space-y-8">
            <div className="space-y-6">
              {[
                { icon: Mail, text: "Secure email verification" },
                { icon: Shield, text: "Protected reset process" },
                { icon: CheckCircle, text: "Quick & easy recovery" },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-white/90">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <blockquote className="border-l-2 border-white/30 pl-4 space-y-2">
              <p className="text-lg text-white/90 italic">
                &ldquo;Forgot your password? No worries! We&apos;ll help you
                reset it securely.&rdquo;
              </p>
              <footer className="text-sm text-white/60">Password Recovery</footer>
            </blockquote>
          </div>
        </motion.div>

        {/* Right Panel - Form */}
        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-[400px] space-y-8"
          >
            {/* Header */}
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6, delay: 0.3 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 shadow-lg shadow-amber-500/25"
              >
                <KeyRound className="h-8 w-8 text-white" />
              </motion.div>

              <Badge variant="glass" className="gap-1.5">
                <Sparkles className="h-3 w-3" />
                Password Recovery
              </Badge>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  <span className="text-gradient">Forgot</span> Password
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Enter your email address and we&apos;ll send you a link to reset
                  your password
                </p>
              </div>
            </div>

            {/* Form Card */}
            <Card className="border-border/50 shadow-soft-xl bg-card/80 backdrop-blur-xl">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <ForgotPasswordForm />

                <Separator className="bg-border/50" />

                <Button asChild variant="ghost" className="w-full">
                  <Link href="/staff-login" className="text-sm">
                    Remember your password? Sign in here
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Mobile brand */}
            <p className="text-center text-xs text-muted-foreground lg:hidden">
              EverKind Community Support - Password Recovery
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
