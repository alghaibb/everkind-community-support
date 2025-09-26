"use client";

import React, {
  useTransition,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Award,
  CheckCircle,
  Sparkles,
  Clock,
  FileText,
  Shield,
  GraduationCap,
  Upload,
} from "lucide-react";
import { hasAvailabilitySelected, isFieldEmpty } from "@/lib/form-utils";
import { CareerFormValues } from "@/lib/validations/careers/career.schema";
import { careerSteps } from "./steps";
import { sendCareerApplication } from "./actions";
import { useSmartForm } from "@/hooks/use-smart-form";
import ApplicationProgress from "./_components/ApplicationProgress";
import {
  PersonalInfoForm,
  CertificationsForm,
  ChecksForm,
  TrainingExperienceForm,
  DocumentsForm,
} from "./forms";

// Storage keys
const CAREER_DATA_KEY = "everkind-career-data";
const COMPLETED_STEPS_KEY = "everkind-completed-steps";

interface CareerFormProps {
  selectedRole?: string;
}

// Step icons mapping
const stepIcons = {
  "personal-info": FileText,
  certifications: Award,
  checks: Shield,
  "training-experience": GraduationCap,
  documents: Upload,
};

export default function CareerForm({ selectedRole }: CareerFormProps) {
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  // Load data from localStorage on mount
  const [careerData, setCareerData] = useState<Partial<CareerFormValues>>(
    () => {
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem(CAREER_DATA_KEY);
          const parsed = saved ? JSON.parse(saved) : {};
          return {
            ...parsed,
            role: selectedRole || parsed.role || "",
            certificates: parsed.certificates || [],
          };
        } catch (error) {
          console.error("Error loading career data from localStorage:", error);
          return { role: selectedRole || "", certificates: [] };
        }
      }
      return { role: selectedRole || "", certificates: [] };
    }
  );

  const [completedSteps, setCompletedSteps] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(COMPLETED_STEPS_KEY);
        return saved ? new Set(JSON.parse(saved)) : new Set();
      } catch (error) {
        console.error(
          "Error loading completed steps from localStorage:",
          error
        );
        return new Set();
      }
    }
    return new Set();
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const currentStep = Math.max(
    0,
    Math.min(careerSteps.length - 1, parseInt(searchParams.get("step") || "0"))
  );

  // Smart form integration
  const {
    lastSaved,
    isSaving,
    estimatedTimeRemaining,
    completionScore,
    showSmartNotification,
  } = useSmartForm(careerData, setCareerData, {
    autoSaveDelay: 2000,
    showProgressEstimation: true,
    enableSmartSuggestions: true,
  });

  // Save careerData to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CAREER_DATA_KEY, JSON.stringify(careerData));
      } catch (error) {
        console.error("Error saving career data to localStorage:", error);
      }
    }
  }, [careerData]);

  // Save completedSteps to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          COMPLETED_STEPS_KEY,
          JSON.stringify([...completedSteps])
        );
      } catch (error) {
        console.error("Error saving completed steps to localStorage:", error);
      }
    }
  }, [completedSteps]);

  // Set mounted to true after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Smart notifications based on progress
  useEffect(() => {
    if (
      completionScore === 25 ||
      completionScore === 50 ||
      completionScore === 75
    ) {
      showSmartNotification("progress");
    }
  }, [completionScore, showSmartNotification]);

  const handleNext = useCallback(async () => {
    setCompletedSteps((prev) =>
      new Set(prev).add(careerSteps[currentStep].key)
    );

    if (currentStep < careerSteps.length - 1) {
      const nextStep = currentStep + 1;
      const params = new URLSearchParams(searchParams);
      params.set("step", nextStep.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [currentStep, searchParams, router, setCompletedSteps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      const params = new URLSearchParams(searchParams);
      params.set("step", prevStep.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [currentStep, searchParams, router]);

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      // Allow going back to completed steps
      const params = new URLSearchParams(searchParams);
      params.set("step", stepIndex.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    } else if (stepIndex === currentStep) {
      // Do nothing if clicking current step
      return;
    } else {
      // Allow forward navigation if previous steps are completed
      const allPreviousCompleted = Array.from({ length: stepIndex }, (_, i) =>
        completedSteps.has(careerSteps[i].key)
      ).every(Boolean);

      if (allPreviousCompleted) {
        const params = new URLSearchParams(searchParams);
        params.set("step", stepIndex.toString());
        router.push(`?${params.toString()}`, { scroll: false });
      } else {
        toast.error("Please complete the previous steps first.");
      }
    }
  };

  const validateAllSteps = useCallback(() => {
    // Check if all required fields are filled
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "cert3IndividualSupport",
      "covidVaccinations",
      "influenzaVaccination",
      "workingWithChildrenCheck",
      "ndisScreeningCheck",
      "policeCheck",
      "workingRights",
      "ndisModules",
      "firstAidCPR",
      "experience",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = careerData[field as keyof typeof careerData];
      return isFieldEmpty(value);
    });

    // Special validation for availability - check if at least one day/time is selected
    const availability = careerData.availability as
      | Record<string, { am: boolean; pm: boolean }>
      | undefined;
    if (!hasAvailabilitySelected(availability)) {
      missingFields.push("availability");
    }

    return missingFields;
  }, [careerData]);

  const onSubmit = useCallback(async () => {
    // Mark final step as completed when submitting
    setCompletedSteps((prev) =>
      new Set(prev).add(careerSteps[careerSteps.length - 1].key)
    );

    // Check for missing required fields
    const missingFields = validateAllSteps();

    if (missingFields.length > 0) {
      toast.error(
        `Please complete the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    startTransition(async () => {
      try {
        const result = await sendCareerApplication(
          careerData as CareerFormValues
        );
        if ("success" in result) {
          toast.success(result.success);
          setCareerData({});
          setCompletedSteps(new Set());

          // Clear localStorage after successful submission
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem(CAREER_DATA_KEY);
              localStorage.removeItem(COMPLETED_STEPS_KEY);
            } catch (error) {
              console.error("Error clearing localStorage:", error);
            }
          }

          // Reset to first step
          const params = new URLSearchParams(searchParams);
          params.set("step", "0");
          router.push(`?${params.toString()}`, { scroll: false });
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("Failed to submit application. Please try again.");
      }
    });
  }, [
    careerData,
    validateAllSteps,
    startTransition,
    setCareerData,
    setCompletedSteps,
    searchParams,
    router,
  ]);

  const renderStepContent = () => {
    const stepKey = careerSteps[currentStep].key;

    switch (stepKey) {
      case "personal-info":
        return (
          <PersonalInfoForm
            careerData={careerData}
            setCareerData={setCareerData}
          />
        );
      case "certifications":
        return (
          <CertificationsForm
            careerData={careerData}
            setCareerData={setCareerData}
            selectedRole={selectedRole}
          />
        );
      case "checks":
        return (
          <ChecksForm careerData={careerData} setCareerData={setCareerData} />
        );
      case "training-experience":
        return (
          <TrainingExperienceForm
            careerData={careerData}
            setCareerData={setCareerData}
          />
        );
      case "documents":
        return (
          <DocumentsForm
            careerData={careerData}
            setCareerData={setCareerData}
          />
        );
      default:
        return null;
    }
  };

  const progress = useMemo(
    () => ((currentStep + 1) / careerSteps.length) * 100,
    [currentStep]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-xl lg:shadow-2xl border-0 bg-gradient-to-br from-background to-muted/10 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b pb-4 lg:pb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 lg:mb-6">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="p-2 lg:p-3 bg-gradient-to-br from-primary to-primary/80 rounded-lg lg:rounded-xl shadow-lg">
                      <Award className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl lg:text-2xl font-bold">
                        Career Application
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {selectedRole} Position
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                    {lastSaved && (
                      <div className="flex items-center gap-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-green-500"
                        />
                        <span className="text-green-600 text-xs">
                          Saved {new Date(lastSaved).toLocaleTimeString()}
                        </span>
                      </div>
                    )}

                    {estimatedTimeRemaining && estimatedTimeRemaining > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground text-xs">
                          ~{Math.ceil(estimatedTimeRemaining / 60)} min left
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 lg:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2">
                      <div className="p-1 bg-primary/10 rounded">
                        {React.createElement(
                          stepIcons[
                            careerSteps[currentStep]
                              .key as keyof typeof stepIcons
                          ],
                          { className: "h-4 w-4 text-primary" }
                        )}
                      </div>
                      <span className="truncate">
                        {careerSteps[currentStep].title}
                      </span>
                    </h3>
                    <div className="flex items-center gap-3 lg:gap-4">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary text-xs"
                      >
                        Step {currentStep + 1} of {careerSteps.length}
                      </Badge>
                      <div className="text-right">
                        <div className="text-xl lg:text-2xl font-bold text-primary">
                          {Math.round(progress)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Progress Bar */}
                  <div className="relative">
                    <Progress value={progress} className="h-3 bg-muted/30" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/50 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {careerSteps[currentStep].description}
                  </p>
                </div>

                {/* Smart Step Navigation */}
                <div className="mt-4 lg:mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2">
                    {careerSteps.map((step, index) => {
                      const StepIcon =
                        stepIcons[step.key as keyof typeof stepIcons];
                      const isCompleted =
                        mounted && completedSteps.has(step.key);
                      const isCurrent = index === currentStep;
                      const isAccessible = index <= currentStep || isCompleted;

                      return (
                        <motion.button
                          key={step.key}
                          onClick={() => handleStepClick(index)}
                          disabled={!isAccessible}
                          className={`group relative flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm font-medium transition-all duration-300 ${
                            isCurrent
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : isCompleted
                                ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                                : isAccessible
                                  ? "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                                  : "bg-muted/20 text-muted-foreground/50 cursor-not-allowed"
                          }`}
                          whileHover={isAccessible ? { scale: 1.02 } : {}}
                          whileTap={isAccessible ? { scale: 0.98 } : {}}
                        >
                          <div
                            className={`flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6 rounded-full text-xs transition-all ${
                              isCurrent
                                ? "bg-primary-foreground/20"
                                : isCompleted
                                  ? "bg-green-600 text-white"
                                  : "bg-muted-foreground/20"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4" />
                            ) : (
                              <StepIcon className="h-3 w-3 lg:h-4 lg:w-4" />
                            )}
                          </div>
                          <span className="truncate text-left">
                            {step.title}
                          </span>

                          {isCompleted && (
                            <Badge
                              variant="secondary"
                              className="text-xs py-0.5 px-1.5 bg-green-100 text-green-700 ml-auto"
                            >
                              Done
                            </Badge>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </CardHeader>

              {/* Form Content */}
              <CardContent className="p-4 lg:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[400px] lg:min-h-[500px]"
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t mt-8 flex-col md:flex-row gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-6"
                    size="lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep === careerSteps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={onSubmit}
                      disabled={isPending}
                      size="lg"
                    >
                      {isPending ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Sparkles className="h-4 w-4" />
                          </motion.div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Award className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6"
                      size="lg"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Smart Progress Sidebar - Right Side */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-8">
            <ApplicationProgress
              currentStep={currentStep}
              totalSteps={careerSteps.length}
              completedSteps={completedSteps}
              formData={careerData}
              estimatedTimeRemaining={estimatedTimeRemaining || undefined}
              onStepClick={handleStepClick}
            />
          </div>
        </div>

        {/* Mobile Progress - Show below form on mobile */}
        <div className="lg:hidden mt-6">
          <ApplicationProgress
            currentStep={currentStep}
            totalSteps={careerSteps.length}
            completedSteps={completedSteps}
            formData={careerData}
            estimatedTimeRemaining={estimatedTimeRemaining || undefined}
            onStepClick={handleStepClick}
          />
        </div>
      </div>

      {/* Auto-save Indicator */}
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2 z-50"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
            Auto-saving...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
