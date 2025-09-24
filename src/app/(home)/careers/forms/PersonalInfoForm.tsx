"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CareerFormStepProps } from "@/app/(home)/careers/steps";
import {
  personalInfoSchema,
  PersonalInfoValues,
} from "@/lib/validations/careers/career.schema";
import { useSmartForm } from "@/hooks/use-smart-form";
import {
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  Clock,
} from "lucide-react";

export default function PersonalInfoForm({
  careerData,
  setCareerData,
}: CareerFormStepProps) {
  const [fieldFocus, setFieldFocus] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: careerData.firstName || "",
      lastName: careerData.lastName || "",
      email: careerData.email || "",
      phone: careerData.phone || "",
    },
    mode: "onChange",
  });

  const {
    lastSaved,
    isSaving,
    estimatedTimeRemaining,
    completionScore,
    validateField,
    showSmartNotification,
  } = useSmartForm(careerData, setCareerData, {
    autoSaveDelay: 1500,
    showProgressEstimation: true,
    enableSmartSuggestions: true,
  });

  // Watch form changes and update parent state
  useEffect(() => {
    const subscription = form.watch(async (values) => {
      // Real-time validation
      const errors: Record<string, string> = {};
      Object.entries(values).forEach(([key, value]) => {
        const error = validateField(key, value);
        if (error) errors[key] = error;
      });
      setValidationErrors(errors);

      // Update parent state if valid
      if (Object.keys(errors).length === 0) {
        setCareerData({
          ...careerData,
          ...values,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [form, careerData, setCareerData, validateField]);

  // Smart notifications based on progress
  useEffect(() => {
    if (completionScore === 25 || completionScore === 50) {
      showSmartNotification("progress");
    }
  }, [completionScore, showSmartNotification]);

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.startsWith("61")) {
      return numbers.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "+$1 $2 $3 $4");
    }
    if (numbers.startsWith("0")) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3");
    }
    return numbers.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  };

  const getFieldIcon = (
    fieldName: string,
    hasError: boolean,
    hasValue: boolean
  ) => {
    if (hasError) return <AlertCircle className="h-4 w-4 text-destructive" />;
    if (hasValue) return <CheckCircle2 className="h-4 w-4 text-green-600" />;

    const icons = {
      firstName: <User className="h-4 w-4 text-muted-foreground" />,
      lastName: <User className="h-4 w-4 text-muted-foreground" />,
      email: <Mail className="h-4 w-4 text-muted-foreground" />,
      phone: <Phone className="h-4 w-4 text-muted-foreground" />,
    };

    return icons[fieldName as keyof typeof icons];
  };

  const getFieldHelperText = (fieldName: string) => {
    const helpers = {
      email: "We'll use this to contact you about your application",
      phone: "Australian mobile or landline number",
      firstName: "As it appears on your ID documents",
      lastName: "As it appears on your ID documents",
    };

    return helpers[fieldName as keyof typeof helpers];
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Header with Smart Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
              <User className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <p className="text-sm text-muted-foreground">
                Tell us about yourself
              </p>
            </div>
          </div>

          {/* Smart Progress Indicators */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  completionScore > 0 ? "bg-green-500" : "bg-muted"
                }`}
              />
              <span className="text-muted-foreground">
                {completionScore}% Complete
              </span>
            </div>

            {estimatedTimeRemaining && estimatedTimeRemaining > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  ~{Math.ceil(estimatedTimeRemaining / 60)} min remaining
                </span>
              </div>
            )}

            {lastSaved && (
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <span className="text-green-600 text-xs">
                  Auto-saved {new Date(lastSaved).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Form */}
        <Form {...form}>
          <div className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span>First Name *</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getFieldHelperText("firstName")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your first name"
                          className={`pl-10 transition-all duration-200 ${
                            fieldFocus === "firstName"
                              ? "ring-2 ring-primary/20"
                              : ""
                          }`}
                          {...field}
                          onFocus={() => setFieldFocus("firstName")}
                          onBlur={() => setFieldFocus(null)}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          {getFieldIcon(
                            "firstName",
                            !!validationErrors.firstName,
                            !!field.value
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                    {validationErrors.firstName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-destructive"
                      >
                        {validationErrors.firstName}
                      </motion.p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span>Last Name *</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getFieldHelperText("lastName")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your last name"
                          className={`pl-10 transition-all duration-200 ${
                            fieldFocus === "lastName"
                              ? "ring-2 ring-primary/20"
                              : ""
                          }`}
                          {...field}
                          onFocus={() => setFieldFocus("lastName")}
                          onBlur={() => setFieldFocus(null)}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          {getFieldIcon(
                            "lastName",
                            !!validationErrors.lastName,
                            !!field.value
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <span>Email Address *</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getFieldHelperText("email")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        className={`pl-10 transition-all duration-200 ${
                          fieldFocus === "email" ? "ring-2 ring-primary/20" : ""
                        }`}
                        {...field}
                        onFocus={() => setFieldFocus("email")}
                        onBlur={() => setFieldFocus(null)}
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        {getFieldIcon(
                          "email",
                          !!validationErrors.email,
                          !!field.value
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    {getFieldHelperText("email")}
                  </p>
                </FormItem>
              )}
            />

            {/* Phone Field with Smart Formatting */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <span>Phone Number *</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getFieldHelperText("phone")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="tel"
                        placeholder="0412 345 678"
                        className={`pl-10 transition-all duration-200 ${
                          fieldFocus === "phone" ? "ring-2 ring-primary/20" : ""
                        }`}
                        {...field}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                        onFocus={() => setFieldFocus("phone")}
                        onBlur={() => setFieldFocus(null)}
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        {getFieldIcon(
                          "phone",
                          !!validationErrors.phone,
                          !!field.value
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    {getFieldHelperText("phone")}
                  </p>
                </FormItem>
              )}
            />
          </div>
        </Form>

        {/* Smart Completion Status */}
        <AnimatePresence>
          {completionScore > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    Looking good! Your personal information is {completionScore}
                    % complete.
                  </p>
                  {completionScore === 100 && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ All required fields completed. Ready to move to the next
                      step!
                    </p>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  {completionScore}%
                </Badge>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Indicator for Auto-save */}
        <AnimatePresence>
          {isSaving && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2 z-50"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
              Saving...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
