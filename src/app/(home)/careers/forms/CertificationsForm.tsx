"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CareerFormStepProps } from "@/app/(home)/careers/steps";
import { getCertificationsSchema } from "@/lib/validations/careers/career.schema";
import { Award } from "lucide-react";

interface CertificationsFormProps extends CareerFormStepProps {
  selectedRole?: string;
}

export default function CertificationsForm({
  careerData,
  setCareerData,
  selectedRole,
}: CertificationsFormProps) {
  const certificationsSchema = getCertificationsSchema(
    selectedRole || "Support Worker"
  );

  const form = useForm({
    resolver: zodResolver(certificationsSchema),
    defaultValues:
      selectedRole === "Support Worker"
        ? {
            cert3IndividualSupport:
              (careerData as Record<string, string>).cert3IndividualSupport ||
              "",
            covidVaccinations:
              (careerData as Record<string, string>).covidVaccinations || "",
            influenzaVaccination:
              (careerData as Record<string, string>).influenzaVaccination || "",
          }
        : {
            ahpraRegistration:
              (careerData as Record<string, string>).ahpraRegistration || "",
            covidVaccinations:
              (careerData as Record<string, string>).covidVaccinations || "",
            influenzaVaccination:
              (careerData as Record<string, string>).influenzaVaccination || "",
          },
  });

  // Sync form values when careerData changes from external sources
  useEffect(() => {
    const currentValues = form.getValues();
    const newValues =
      selectedRole === "Support Worker"
        ? {
            cert3IndividualSupport:
              (careerData as Record<string, string>).cert3IndividualSupport ||
              "",
            covidVaccinations:
              (careerData as Record<string, string>).covidVaccinations || "",
            influenzaVaccination:
              (careerData as Record<string, string>).influenzaVaccination || "",
          }
        : {
            ahpraRegistration:
              (careerData as Record<string, string>).ahpraRegistration || "",
            covidVaccinations:
              (careerData as Record<string, string>).covidVaccinations || "",
            influenzaVaccination:
              (careerData as Record<string, string>).influenzaVaccination || "",
          };

    // Only reset if values are actually different to avoid infinite loops
    const hasChanges = Object.entries(newValues).some(
      ([key, value]) =>
        currentValues[key as keyof typeof currentValues] !== value
    );

    if (hasChanges) {
      form.reset(newValues);
    }
  }, [careerData, selectedRole, form]);

  // Use ref to avoid stale closure issues
  const careerDataRef = useRef(careerData);
  careerDataRef.current = careerData;

  // Watch for form changes and update careerData
  useEffect(() => {
    const subscription = form.watch((values) => {
      const currentData = careerDataRef.current;
      const updatedData = {
        ...currentData,
        ...values,
      };
      setCareerData(updatedData);
    });
    return () => subscription.unsubscribe();
  }, [form, setCareerData, selectedRole]);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">
            Certifications & Qualifications
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Please provide details about your required certifications and
          qualifications.
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name={
              selectedRole === "Support Worker"
                ? "cert3IndividualSupport"
                : "ahpraRegistration"
            }
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {selectedRole === "Support Worker"
                    ? "Certificate III in Individual Support *"
                    : "AHPRA Registration Number *"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      selectedRole === "Support Worker"
                        ? "e.g., Completed, In Progress, or Certificate Number"
                        : "e.g., Nursing and Midwifery Board Registration Number"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="covidVaccinations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>COVID-19 Vaccination Status *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Fully Vaccinated, Booster Required"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="influenzaVaccination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Influenza Vaccination Status *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Up to date, Due for vaccination"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
}
