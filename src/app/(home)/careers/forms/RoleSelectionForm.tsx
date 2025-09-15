"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  roleSelectionSchema,
  RoleSelectionValues,
} from "@/lib/validations/careers/career.schema";
import { UserCheck } from "lucide-react";

export default function RoleSelectionForm({
  careerData,
  setCareerData,
}: CareerFormStepProps) {
  const form = useForm<RoleSelectionValues>({
    resolver: zodResolver(roleSelectionSchema),
    defaultValues: {
      role: careerData.role || undefined,
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      setCareerData({
        ...careerData,
        role: values.role,
      });
    });
    return unsubscribe;
  }, [form, careerData, setCareerData]);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <UserCheck className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Choose Your Role</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Select the position you&apos;re applying for. Each role has different
          requirements and responsibilities.
        </p>
      </div>

      <Form {...form}>
        <div className="max-w-2xl mx-auto">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Select Your Position
                </FormLabel>
                <FormControl>
                  <div className="grid gap-4 md:grid-cols-1">
                    {[
                      {
                        value: "Support Worker",
                        title: "Support Worker",
                        description:
                          "Provide essential support and assistance to individuals with disabilities",
                      },
                      {
                        value: "Enrolled Nurse",
                        title: "Enrolled Nurse",
                        description:
                          "Deliver nursing care under the supervision of registered nurses",
                      },
                      {
                        value: "Registered Nurse",
                        title: "Registered Nurse",
                        description:
                          "Provide comprehensive nursing care and clinical leadership",
                      },
                    ].map((role) => (
                      <div
                        key={role.value}
                        className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={field.value === role.value}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange(role.value);
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{role.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {role.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
