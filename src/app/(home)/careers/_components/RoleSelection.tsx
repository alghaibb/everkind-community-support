"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RoleSelectData, CareerFormData } from "@/types/career";
import { useLocalStorageSSR } from "@/hooks/use-local-storage";
import RoleSelectionForm from "../forms/RoleSelectionForm";
import CareerForm from "../CareerForm";
import {
  ArrowLeft,
  Rocket,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

const ROLE_STORAGE_KEY = "everkind-selected-role";
const CAREER_DATA_KEY = "everkind-career-data";
const COMPLETED_STEPS_KEY = "everkind-completed-steps";

/**
 * Modern Role Selection Client Component with enhanced UX
 */
export default function RoleSelection() {
  const router = useRouter();
  const [selectedRole, setSelectedRole, clearSelectedRole, roleMounted] =
    useLocalStorageSSR(ROLE_STORAGE_KEY, "");
  const [careerData, setCareerData, , dataMounted] =
    useLocalStorageSSR<CareerFormData>(CAREER_DATA_KEY, {});
  const [applicationStarted, setApplicationStarted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const mounted = roleMounted && dataMounted;

  /**
   * Handles role selection and updates both role and career data
   */
  const handleRoleSelect = (data: RoleSelectData) => {
    const newRole = data.role || "";
    const updatedCareerData = { ...careerData, role: data.role };

    setSelectedRole(newRole);
    setCareerData(updatedCareerData);
  };

  /**
   * Handles starting the application with smooth transition
   */
  const handleStartApplication = () => {
    setApplicationStarted(true);
  };

  /**
   * Check if user has made progress in the application
   */
  const hasProgress = () => {
    // Check if application has started or if there's any form data
    if (!applicationStarted && Object.keys(careerData).length <= 1) {
      return false;
    }

    // Check if there are completed steps
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(COMPLETED_STEPS_KEY);
        const completedSteps = saved ? JSON.parse(saved) : [];
        if (completedSteps.length > 0) return true;
      } catch (error) {
        console.error("Error checking completed steps:", error);
      }
    }

    // Check if there's meaningful form data (more than just role)
    const meaningfulFields = Object.keys(careerData).filter(
      (key) => key !== "role" && careerData[key] && careerData[key] !== ""
    );

    return applicationStarted || meaningfulFields.length > 0;
  };

  /**
   * Handles role change - shows confirmation if progress exists
   */
  const handleChangeRole = () => {
    if (hasProgress()) {
      setShowConfirmDialog(true);
    } else {
      confirmRoleChange();
    }
  };

  /**
   * Actually performs the role change and clears all data
   */
  const confirmRoleChange = () => {
    // Clear all localStorage data
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(CAREER_DATA_KEY);
        localStorage.removeItem(COMPLETED_STEPS_KEY);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    }

    // Reset URL to remove step parameter
    router.push("/careers", { scroll: false });

    // Reset all state
    clearSelectedRole();
    setCareerData({});
    setApplicationStarted(false);
    setShowConfirmDialog(false);
  };

  // Show loading state until mounted
  if (!mounted) {
    return (
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse space-y-8 w-full">
              <div className="text-center space-y-4">
                <div className="h-8 bg-muted rounded-lg w-64 mx-auto"></div>
                <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-80 bg-muted rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!selectedRole ? (
            // No role selected - show modern role selection
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <RoleSelectionForm
                careerData={careerData}
                setCareerData={handleRoleSelect}
              />
            </motion.div>
          ) : !applicationStarted ? (
            // Role selected but application not started - show confirmation
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-2 border-primary/20 shadow-2xl bg-gradient-to-br from-background to-primary/5">
                <CardContent className="p-8 text-center space-y-8">
                  {/* Success Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full shadow-lg"
                  >
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </motion.div>

                  {/* Title */}
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                      Perfect Choice!
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      You&apos;ve selected the{" "}
                      <span className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                        {selectedRole}
                      </span>{" "}
                      position
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Sparkles className="h-5 w-5" />
                      <span className="font-medium">What&apos;s Next?</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        Complete your application in just 5 minutes
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        Upload your resume and certificates
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        Hear back from our team within 48 hours
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleStartApplication}
                      size="lg"
                      className="px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Rocket className="h-5 w-5 mr-2" />
                      Start Application
                    </Button>
                    <Button
                      onClick={handleChangeRole}
                      variant="outline"
                      size="lg"
                      className="px-6 py-3"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Change Role
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            // Application started - show modern career form
            <motion.div
              key="application-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="text-center mb-8 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full"
                >
                  <Rocket className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Application in Progress
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                >
                  Apply for {selectedRole}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto"
                >
                  Complete your application below. We&apos;ll review your
                  qualifications and get back to you soon.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    onClick={handleChangeRole}
                    variant="link"
                    className="text-sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Change Role
                  </Button>
                </motion.div>
              </div>

              {/* Modern Career Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <CareerForm selectedRole={selectedRole} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <AlertDialogTitle className="text-lg font-semibold">
                Change Role?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
              You have made progress on your current application. Changing roles
              will
              <span className="font-medium text-destructive">
                {" "}
                permanently delete all your progress
              </span>
              , including completed steps and form data.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="bg-muted/30 rounded-lg p-4 my-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">What will be lost:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• All completed form sections</li>
                  <li>• Personal information entered</li>
                  <li>• Uploaded documents</li>
                  <li>• Application progress</li>
                </ul>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">
              Keep Current Progress
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRoleChange}
              className="w-full sm:w-auto bg-destructive hover:bg-destructive/90"
            >
              Yes, Change Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
