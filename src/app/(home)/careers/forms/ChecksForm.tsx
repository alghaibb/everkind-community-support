"use client";

import { useEffect } from "react";
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
import {
  checksSchema,
  ChecksValues,
} from "@/lib/validations/careers/career.schema";
import { FileCheck } from "lucide-react";

export default function ChecksForm({
  careerData,
  setCareerData,
}: CareerFormStepProps) {
  const form = useForm<ChecksValues>({
    resolver: zodResolver(checksSchema),
    defaultValues: {
      workingWithChildrenCheck: careerData.workingWithChildrenCheck || "",
      ndisScreeningCheck: careerData.ndisScreeningCheck || "",
      policeCheck: careerData.policeCheck || "",
      workingRights: careerData.workingRights || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      setCareerData({
        ...careerData,
        ...values,
      });
    });
    return unsubscribe;
  }, [form, careerData, setCareerData]);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FileCheck className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Checks & Clearances</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Please provide details about your required background checks and
          working rights.
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="workingWithChildrenCheck"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Working with Children Check *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Check Number or Clearance Level"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ndisScreeningCheck"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NDIS Screening Check *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Completed, Pending, or Clearance Number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="policeCheck"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Police Check *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., National Police Certificate Number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workingRights"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Working Rights *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Australian Citizen, Permanent Resident, Visa Type"
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
