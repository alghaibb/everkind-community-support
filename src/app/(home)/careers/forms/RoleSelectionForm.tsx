"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CareerFormStepProps } from "@/app/(home)/careers/steps";
import {
  roleSelectionSchema,
  RoleSelectionValues,
} from "@/lib/validations/careers/career.schema";
import { CheckCircle, ArrowRight, Users, Shield, Award } from "lucide-react";
import { CAREER_ROLES } from "../constants";

export default function RoleSelectionForm({
  careerData,
  setCareerData,
}: CareerFormStepProps) {
  const [selectedRole, setSelectedRole] = useState<
    "Support Worker" | "Enrolled Nurse" | "Registered Nurse" | undefined
  >(careerData.role);

  const form = useForm<RoleSelectionValues>({
    resolver: zodResolver(roleSelectionSchema),
    defaultValues: {
      role: careerData.role || undefined,
    },
  });

  useEffect(() => {
    if (selectedRole) {
      form.setValue(
        "role",
        selectedRole as "Support Worker" | "Enrolled Nurse" | "Registered Nurse"
      );
      setCareerData({
        ...careerData,
        role: selectedRole,
      });
    }
  }, [selectedRole, form, careerData, setCareerData]);

  const handleRoleSelect = (
    roleValue: "Support Worker" | "Enrolled Nurse" | "Registered Nurse"
  ) => {
    if (selectedRole === roleValue) {
      // Deselect if already selected
      setSelectedRole(undefined);
      form.setValue("role", undefined);
      setCareerData({
        ...careerData,
        role: undefined,
      });
    } else {
      // Select new role
      setSelectedRole(roleValue);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Choose Your Career Path
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Find Your Perfect Role
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Each position offers unique opportunities to make a difference in
          people&apos;s lives. Select the role that aligns with your skills and
          passion.
        </p>
      </motion.div>

      {/* Role Cards */}
      <Form {...form}>
        <FormField
          control={form.control}
          name="role"
          render={() => (
            <FormItem>
              <FormControl>
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                  {CAREER_ROLES.map((role, index) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.value;

                    return (
                      <motion.div
                        key={role.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8 }}
                        className="relative"
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                            isSelected
                              ? "border-primary shadow-lg shadow-primary/25 ring-4 ring-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() =>
                            handleRoleSelect(
                              role.value as
                                | "Support Worker"
                                | "Enrolled Nurse"
                                | "Registered Nurse"
                            )
                          }
                        >
                          <CardContent className="p-6 space-y-4">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                              <div
                                className={`p-3 rounded-xl ${role.color} text-white shadow-lg`}
                              >
                                <Icon className="h-6 w-6" />
                              </div>
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="p-2 bg-primary/10 rounded-full"
                                  >
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Title & Description */}
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold">
                                {role.title}
                              </h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {role.description}
                              </p>
                            </div>

                            {/* Features */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">
                                  Key Responsibilities
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {role.features.map((feature) => (
                                  <Badge
                                    key={feature}
                                    variant="secondary"
                                    className="text-xs py-1"
                                  >
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Requirements & Salary */}
                            <div className="space-y-2 pt-2 border-t">
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {role.requirements}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-primary">
                                  {role.salary}
                                </span>
                                <Button
                                  size="sm"
                                  variant={isSelected ? "default" : "ghost"}
                                  className="h-8 text-xs"
                                >
                                  {isSelected ? "Selected" : "Select Role"}
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Selection Overlay */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-primary/5 rounded-lg pointer-events-none"
                            />
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      {/* Selection Summary */}
      <AnimatePresence>
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 border border-primary/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Great Choice!</h4>
                <p className="text-sm text-muted-foreground">
                  You&apos;ve selected the{" "}
                  <span className="font-medium text-primary">
                    {selectedRole}
                  </span>{" "}
                  position.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Ready to start your application? Click &quot;Start
              Application&quot; to begin the process.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
