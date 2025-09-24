"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Target,
  Zap,
  Star,
} from "lucide-react";

interface ApplicationProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: Set<string>;
  formData: Record<string, unknown>;
  estimatedTimeRemaining?: number;
  onStepClick?: (stepIndex: number) => void;
}

interface ProgressInsight {
  type: "tip" | "warning" | "success" | "info";
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function ApplicationProgress({
  currentStep,
  totalSteps,
  completedSteps,
  formData,
  estimatedTimeRemaining,
  onStepClick,
}: ApplicationProgressProps) {
  const [insights, setInsights] = useState<ProgressInsight[]>([]);
  const [showDetailedProgress, setShowDetailedProgress] = useState(false);

  const overallProgress = (completedSteps.size / totalSteps) * 100;
  const stepsRemaining = totalSteps - completedSteps.size;

  // Generate smart insights based on progress and data
  useEffect(() => {
    const newInsights: ProgressInsight[] = [];

    // Progress-based insights
    if (overallProgress === 0) {
      newInsights.push({
        type: "tip",
        title: "Getting Started",
        message:
          "Take your time filling out each section. Your progress is automatically saved.",
      });
    } else if (overallProgress < 25) {
      newInsights.push({
        type: "info",
        title: "Good Start!",
        message:
          "You're making progress. Each section builds on the previous one.",
      });
    } else if (overallProgress < 50) {
      newInsights.push({
        type: "success",
        title: "Halfway There!",
        message: "Great job! You're building a strong application profile.",
      });
    } else if (overallProgress < 75) {
      newInsights.push({
        type: "success",
        title: "Almost Done!",
        message: "You're in the final stretch. Keep up the excellent work!",
      });
    } else if (overallProgress < 100) {
      newInsights.push({
        type: "tip",
        title: "Final Steps",
        message:
          "You're so close! Complete the remaining sections to submit your application.",
      });
    }

    // Data quality insights
    const emailProvided =
      typeof formData.email === "string" && formData.email.includes("@");
    const phoneProvided =
      typeof formData.phone === "string" && formData.phone.length > 8;

    if (overallProgress > 25 && (!emailProvided || !phoneProvided)) {
      newInsights.push({
        type: "warning",
        title: "Contact Information",
        message:
          "Make sure your email and phone number are complete for faster communication.",
      });
    }

    // Experience insights
    if (
      typeof formData.experience === "string" &&
      formData.experience.includes("No previous")
    ) {
      newInsights.push({
        type: "tip",
        title: "New to Disability Support?",
        message:
          "No worries! We provide comprehensive training for all new team members.",
      });
    }

    // Time-based insights
    if (estimatedTimeRemaining && estimatedTimeRemaining < 120) {
      // Less than 2 minutes
      newInsights.push({
        type: "success",
        title: "Almost Finished!",
        message: "Less than 2 minutes remaining. You&apos;re doing great!",
      });
    }

    setInsights(newInsights.slice(0, 2)); // Show max 2 insights
  }, [overallProgress, formData, estimatedTimeRemaining]);

  const getInsightIcon = (type: ProgressInsight["type"]) => {
    switch (type) {
      case "tip":
        return <Lightbulb className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4" />;
      case "info":
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getInsightColors = (type: ProgressInsight["type"]) => {
    switch (type) {
      case "tip":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "info":
        return "bg-purple-50 border-purple-200 text-purple-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Progress Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Application Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {Math.round(overallProgress)}%
              </div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">
                {completedSteps.size}/{totalSteps} sections
              </span>
            </div>
            <div className="relative">
              <Progress value={overallProgress} className="h-3" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-semibold">{completedSteps.size}</span>
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Zap className="h-4 w-4" />
                <span className="font-semibold">{stepsRemaining}</span>
              </div>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>

            {estimatedTimeRemaining && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">
                    {Math.ceil(estimatedTimeRemaining / 60)}m
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Est. time</p>
              </div>
            )}
          </div>

          {/* Toggle Detailed View */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetailedProgress(!showDetailedProgress)}
            className="w-full mt-4 text-xs"
          >
            {showDetailedProgress ? "Hide Details" : "Show Detailed Progress"}
          </Button>
        </CardContent>
      </Card>

      {/* Detailed Progress */}
      <AnimatePresence>
        {showDetailedProgress && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Section Details
                </h4>
                <div className="space-y-2">
                  {Array.from({ length: totalSteps }, (_, i) => {
                    const isCompleted = Array.from(completedSteps).includes(
                      `step-${i}`
                    );
                    const isCurrent = i === currentStep;

                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isCurrent ? "bg-primary/10" : "hover:bg-muted/50"
                        }`}
                        onClick={() => onStepClick?.(i)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              isCompleted
                                ? "bg-green-100 text-green-700"
                                : isCurrent
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {isCompleted ? "✓" : i + 1}
                          </div>
                          <span
                            className={`text-sm ${
                              isCurrent ? "font-medium" : ""
                            }`}
                          >
                            Step {i + 1}
                          </span>
                        </div>

                        {isCompleted && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 text-xs"
                          >
                            Complete
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Insights */}
      <AnimatePresence>
        {insights.map((insight, index) => (
          <motion.div
            key={`${insight.type}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`border ${getInsightColors(
                insight.type
              )} bg-opacity-50`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm opacity-90">{insight.message}</p>
                    {insight.action && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={insight.action.onClick}
                        className="mt-2 h-8 px-3 text-xs"
                      >
                        {insight.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
