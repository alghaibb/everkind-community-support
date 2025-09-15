"use client";

import { useTransition, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Award, CheckCircle } from "lucide-react";
import { hasAvailabilitySelected, isFieldEmpty } from "@/lib/form-utils";
import { CareerFormValues } from "@/lib/validations/careers/career.schema";
import { careerSteps } from "./steps";
import { sendCareerApplication } from "./actions";
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

  const handleNext = async () => {
    setCompletedSteps((prev) =>
      new Set(prev).add(careerSteps[currentStep].key)
    );

    if (currentStep < careerSteps.length - 1) {
      const nextStep = currentStep + 1;
      const params = new URLSearchParams(searchParams);
      params.set("step", nextStep.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      const params = new URLSearchParams(searchParams);
      params.set("step", prevStep.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

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

  const validateAllSteps = () => {
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
  };

  const onSubmit = async () => {
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
  };

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

  const progress = ((currentStep + 1) / careerSteps.length) * 100;

  return (
    <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Award className="h-6 w-6 text-primary" />
            </div>
            Career Application
          </CardTitle>
          <div className="flex items-center gap-4">
            {mounted &&
              (Object.keys(careerData).length > 1 ||
                completedSteps.size > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCareerData({ certificates: [] });
                    setCompletedSteps(new Set());
                    if (typeof window !== "undefined") {
                      try {
                        localStorage.removeItem(CAREER_DATA_KEY);
                        localStorage.removeItem(COMPLETED_STEPS_KEY);
                      } catch (error) {
                        console.error("Error clearing localStorage:", error);
                      }
                    }
                    toast.success("Form cleared successfully");
                  }}
                  className="text-xs"
                >
                  Reset Form
                </Button>
              )}
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {currentStep + 1}
              </div>
              <div className="text-sm text-muted-foreground">
                of {careerSteps.length}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {careerSteps[currentStep].title}
              </span>
              <span className="text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3 bg-muted/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full animate-pulse" />
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {careerSteps[currentStep].description}
          </p>
        </div>

        {/* Step Navigation */}
        <div className="flex flex-wrap gap-3 mt-6">
          {careerSteps.map((step, index) => (
            <button
              key={step.key}
              onClick={() => handleStepClick(index)}
              className={`group relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                index === currentStep
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : mounted && completedSteps.has(step.key)
                  ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-300"
                  : index < currentStep
                  ? "bg-muted/50 text-muted-foreground cursor-not-allowed opacity-60"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 border border-transparent hover:border-muted-foreground/20"
              }`}
              disabled={
                index > currentStep &&
                (!mounted ||
                  !Array.from({ length: index }, (_, i) =>
                    completedSteps.has(careerSteps[i].key)
                  ).every(Boolean))
              }
            >
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all ${
                  index === currentStep
                    ? "bg-primary-foreground/20"
                    : mounted && completedSteps.has(step.key)
                    ? "bg-green-600 text-white"
                    : "bg-muted-foreground/20"
                }`}
              >
                {mounted && completedSteps.has(step.key) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="hidden sm:inline">{step.title}</span>
              <span className="sm:hidden">Step {index + 1}</span>

              {/* Active step indicator */}
              {index === currentStep && (
                <div className="absolute inset-0 rounded-xl bg-primary/10 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="min-h-[500px] mb-8">{renderStepContent()}</div>

        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep === careerSteps.length - 1 ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isPending}
              className="flex items-center gap-2 px-8"
            >
              {isPending ? "Submitting..." : "Submit Application"}
              <Award className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
