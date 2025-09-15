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
  personalInfoSchema,
  PersonalInfoValues,
} from "@/lib/validations/careers/career.schema";
import { Shield } from "lucide-react";

export default function PersonalInfoForm({
  careerData,
  setCareerData,
}: CareerFormStepProps) {
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: careerData.firstName || "",
      lastName: careerData.lastName || "",
      email: careerData.email || "",
      phone: careerData.phone || "",
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
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Personal Information</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Please provide your basic contact information.
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
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
