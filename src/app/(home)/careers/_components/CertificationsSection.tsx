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
import { Award } from "lucide-react";

interface CertificationsSectionProps {
  form: UseFormReturn<CareerFormValues>;
}

export default function CertificationsSection({ form }: CertificationsSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Award className="h-4 w-4" />
        Certifications & Qualifications
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cert3IndividualSupport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificate III in Individual Support *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Certificate number or completion date"
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
              <FormLabel>COVID-19 Vaccinations *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Number of vaccinations and dates"
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
              <FormLabel>Influenza Vaccination *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Vaccination date or status"
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
              <FormLabel>First Aid & CPR *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Certification details and expiry"
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
