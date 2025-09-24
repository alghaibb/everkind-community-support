"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface SmartFormOptions {
  autoSaveDelay?: number;
  showProgressEstimation?: boolean;
  enableSmartSuggestions?: boolean;
}

export function useSmartForm(
  formData: Record<string, any>,
  onSave: (data: Record<string, any>) => void,
  options: SmartFormOptions = {}
) {
  const {
    autoSaveDelay = 2000,
    showProgressEstimation = true,
    enableSmartSuggestions = true,
  } = options;

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
  const [completionScore, setCompletionScore] = useState(0);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        setIsSaving(true);
        onSave(formData);
        setLastSaved(new Date());
        setIsSaving(false);
      }
    }, autoSaveDelay);

    return () => clearTimeout(timer);
  }, [formData, autoSaveDelay, onSave]);

  // Calculate completion score
  useEffect(() => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'covidVaccinations', 'influenzaVaccination',
      'workingWithChildrenCheck', 'ndisScreeningCheck',
      'policeCheck', 'workingRights', 'firstAidCPR',
      'experience', 'availability'
    ];

    const completedFields = requiredFields.filter(field => {
      const value = formData[field];
      return value && value !== '' && value !== undefined;
    }).length;

    const score = Math.round((completedFields / requiredFields.length) * 100);
    setCompletionScore(score);

    // Estimate time remaining (rough calculation)
    if (showProgressEstimation && completedFields > 0) {
      const avgTimePerField = 30; // seconds
      const remainingFields = requiredFields.length - completedFields;
      setEstimatedTimeRemaining(remainingFields * avgTimePerField);
    }
  }, [formData, showProgressEstimation]);

  // Smart field suggestions
  const getFieldSuggestions = useCallback((fieldName: string, currentValue: string) => {
    if (!enableSmartSuggestions) return [];

    const suggestions: Record<string, string[]> = {
      experience: [
        "No previous experience in disability support",
        "Less than 1 year experience in disability support",
        "1-2 years experience in disability support",
        "2-5 years experience in disability support",
        "5+ years experience in disability support"
      ],
      ndisModules: [
        "Person-Centered Support",
        "Communication and Language Support",
        "Maintaining Dignity of Risk",
        "Recognising Healthy Body Systems",
        "Disability Advocacy",
        "Understanding Disability"
      ]
    };

    return suggestions[fieldName] || [];
  }, [enableSmartSuggestions]);

  // Validation helpers
  const validateField = useCallback((fieldName: string, value: any) => {
    const validations: Record<string, (val: any) => string | null> = {
      email: (val) => {
        if (!val) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val) ? null : "Please enter a valid email address";
      },
      phone: (val) => {
        if (!val) return "Phone number is required";
        const phoneRegex = /^(\+61|0)[2-9]\d{8}$/;
        return phoneRegex.test(val.replace(/\s/g, '')) ? null : "Please enter a valid Australian phone number";
      },
      firstName: (val) => val && val.length >= 2 ? null : "First name must be at least 2 characters",
      lastName: (val) => val && val.length >= 2 ? null : "Last name must be at least 2 characters",
    };

    return validations[fieldName]?.(value) || null;
  }, []);

  // Smart notifications
  const showSmartNotification = useCallback((type: 'progress' | 'suggestion' | 'validation') => {
    switch (type) {
      case 'progress':
        if (completionScore === 25) {
          toast.success("Great start! You're 25% complete.");
        } else if (completionScore === 50) {
          toast.success("Halfway there! Keep going.");
        } else if (completionScore === 75) {
          toast.success("Almost done! Just a few more fields.");
        }
        break;
      case 'suggestion':
        if (completionScore > 80 && estimatedTimeRemaining && estimatedTimeRemaining < 60) {
          toast.info("You're almost finished! Less than a minute to go.");
        }
        break;
    }
  }, [completionScore, estimatedTimeRemaining]);

  return {
    lastSaved,
    isSaving,
    estimatedTimeRemaining,
    completionScore,
    getFieldSuggestions,
    validateField,
    showSmartNotification,
  };
}
