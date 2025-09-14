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
import { Award } from "lucide-react";

interface TrainingSectionProps {
  form: UseFormReturn<CareerFormValues>;
}

export default function TrainingSection({ form }: TrainingSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Award className="h-4 w-4" />
        Training & Modules
      </h3>

      <FormField
        control={form.control}
        name="ndisModules"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              NDIS Modules (Infection Control, Hand Hygiene) *
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your completion of NDIS required modules"
                className="min-h-24"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
