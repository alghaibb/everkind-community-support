"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home, Search, AlertTriangle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleGoBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push("/");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto relative">
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center space-y-8">
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-destructive/10 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-destructive/20 rounded-full animate-pulse animation-delay-75"></div>
                <AlertTriangle className="w-12 h-12 text-destructive absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-8xl font-bold text-foreground/20 tracking-wider">
                404
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Page Not Found
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
                have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                onClick={handleGoBack}
                className="w-full sm:w-auto"
                size="lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto "
                size="lg"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>

            <div className="pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-4">
                Need help finding what you&apos;re looking for?
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Button variant="link" asChild>
                  <Link href="/">
                    <Home className="w-3 h-3 mr-1" />
                    Homepage
                  </Link>
                </Button>

                <Button variant="link" asChild>
                  <Link href="/contact-us">
                    <Search className="w-3 h-3 mr-1" />
                    Contact Us
                  </Link>
                </Button>

                <Button variant="link" asChild>
                  <Link href="/careers">
                    <Search className="w-3 h-3 mr-1" />
                    Careers
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
