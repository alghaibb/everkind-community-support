"use client";

import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CareerFormStepProps } from "@/app/(home)/careers/steps";
import { trainingExperienceSchema } from "@/lib/validations/careers/career.schema";
import { BookOpen, Clock } from "lucide-react";
import { AvailabilityData } from "@/types/career";

export default function TrainingExperienceForm({
  careerData,
  setCareerData,
}: CareerFormStepProps) {
  const getDefaultAvailability = useCallback((): AvailabilityData => {
    const savedAvailability = careerData.availability;
    if (
      savedAvailability &&
      typeof savedAvailability === "object" &&
      !Array.isArray(savedAvailability)
    ) {
      return savedAvailability as AvailabilityData;
    }
    return {
      monday: { am: false, pm: false },
      tuesday: { am: false, pm: false },
      wednesday: { am: false, pm: false },
      thursday: { am: false, pm: false },
      friday: { am: false, pm: false },
      saturday: { am: false, pm: false },
      sunday: { am: false, pm: false },
    };
  }, [careerData.availability]);

  const form = useForm({
    resolver: zodResolver(trainingExperienceSchema),
    defaultValues: {
      ndisModules: careerData.ndisModules || "",
      firstAidCPR: careerData.firstAidCPR || "",
      experience: careerData.experience || "",
      availability: getDefaultAvailability(),
    },
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setCareerData({
        ...careerData,
        ndisModules: values.ndisModules || "",
        firstAidCPR: values.firstAidCPR || "",
        experience: values.experience || "",
        availability:
          (values.availability as AvailabilityData) || getDefaultAvailability(),
      });
    });
    return () => subscription.unsubscribe();
  }, [form, careerData, setCareerData, getDefaultAvailability]);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Training & Experience</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Please provide details about your training and relevant experience.
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="ndisModules"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NDIS Modules Completed *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Core Modules, Specialist Modules completed"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstAidCPR"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Aid & CPR Certification *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., HLTAID011 Provide First Aid, current certification date"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relevant Experience *</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Please describe your experience working with people with disabilities, elderly care, or similar roles. Include years of experience and specific responsibilities."
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <FormLabel className="text-base font-medium">
                Availability *
              </FormLabel>
            </div>
            <p className="text-sm text-muted-foreground">
              Please select your available days and times
            </p>

            <div className="space-y-3">
              {/* Monday */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium text-sm">Monday</span>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="availability.monday.am"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          AM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availability.monday.pm"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          PM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Tuesday */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium text-sm">Tuesday</span>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="availability.tuesday.am"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          AM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availability.tuesday.pm"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          PM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Wednesday */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium text-sm">Wednesday</span>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="availability.wednesday.am"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          AM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availability.wednesday.pm"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          PM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Thursday */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium text-sm">Thursday</span>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="availability.thursday.am"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          AM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availability.thursday.pm"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          PM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Friday */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium text-sm">Friday</span>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="availability.friday.am"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          AM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availability.friday.pm"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          PM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Saturday */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium text-sm">Saturday</span>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="availability.saturday.am"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          AM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availability.saturday.pm"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          PM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Sunday */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium text-sm">Sunday</span>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="availability.sunday.am"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          AM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="availability.sunday.pm"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          PM
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
