import { UseFormReturn } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CareerFormValues } from "@/lib/validations/career.schema";
import { FileText } from "lucide-react";

interface ExperienceSectionProps {
  form: UseFormReturn<CareerFormValues>;
}

export default function ExperienceSection({ form }: ExperienceSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Experience & Availability
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relevant Experience *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your experience in community support, aged care, or disability services"
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your availability (full-time, part-time, days, shifts, etc.)"
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
