"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { UserX, Home, ArrowLeft, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md p-8 backdrop-blur-sm bg-background/95 shadow-2xl border-orange-500/20">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="relative mx-auto w-24 h-24"
            >
              <div className="absolute inset-0 bg-orange-500/10 rounded-full animate-pulse" />
              <div className="relative flex items-center justify-center w-full h-full">
                <UserX className="w-12 h-12 text-orange-500" />
              </div>
              <motion.div
                className="absolute -inset-2 rounded-full border-2 border-orange-500/30"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-7xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                401
              </h1>
              <h2 className="text-2xl font-semibold mt-2">
                Unauthorized Access
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground"
            >
              You need to be logged in to access this page. Please sign in with
              your credentials to continue.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-orange-500/10 rounded-full mx-auto w-fit"
            >
              <LogIn className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-500">
                Authentication Required
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Button asChild className="flex-1">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-4 text-sm"
            >
              <Link
                href="/contact-us"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Need help?
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/careers"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Join our team
              </Link>
            </motion.div>
          </div>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          If you&apos;re having trouble accessing your account, please contact
          support.
        </motion.p>
      </motion.div>
    </div>
  );
}
