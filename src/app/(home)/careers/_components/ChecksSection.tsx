import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CareerFormValues } from "@/lib/validations/career.schema";
import { Shield } from "lucide-react";

interface ChecksSectionProps {
  form: UseFormReturn<CareerFormValues>;
}

export default function ChecksSection({ form }: ChecksSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Checks & Clearances
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="workingWithChildrenCheck"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Working with Children Check *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Check number and expiry date"
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
                  placeholder="Screening clearance details"
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
                  placeholder="Police clearance details"
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
                  placeholder="Visa status or working rights"
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
