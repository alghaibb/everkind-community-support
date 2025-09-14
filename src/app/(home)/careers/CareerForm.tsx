"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, FileText, Award, Shield, X, CheckCircle } from "lucide-react";

import {
  careerSchema,
  CareerFormValues,
} from "@/lib/validations/career.schema";
import { sendCareerApplication } from "./actions";

interface UploadedFile {
  name: string;
  url: string;
  type: "resume" | "certificates" | "references";
}

export default function CareerForm() {
  const [isPending, startTransition] = useTransition();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  const handleFileUpload = async (
    file: File,
    type: "resume" | "certificates" | "references"
  ) => {
    if (!file) return;

    const fileId = `${type}-${file.name}`;
    setUploadingFiles((prev) => new Set(prev).add(fileId));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const uploadedFile: UploadedFile = {
          name: file.name,
          url: result.url,
          type,
        };

        setUploadedFiles((prev) => [...prev, uploadedFile]);

        // Update form values
        if (type === "resume") {
          form.setValue("resume", result.url);
        } else if (type === "certificates") {
          form.setValue("certificates", result.url);
        } else if (type === "references") {
          form.setValue("references", result.url);
        }

        toast.success(`${file.name} uploaded successfully!`);
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const removeFile = (type: "resume" | "certificates" | "references") => {
    setUploadedFiles((prev) => prev.filter((f) => f.type !== type));
    if (type === "resume") {
      form.setValue("resume", "");
    } else if (type === "certificates") {
      form.setValue("certificates", "");
    } else if (type === "references") {
      form.setValue("references", "");
    }
  };

  const form = useForm<CareerFormValues>({
    resolver: zodResolver(careerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      cert3IndividualSupport: "",
      covidVaccinations: "",
      influenzaVaccination: "",
      workingWithChildrenCheck: "",
      ndisScreeningCheck: "",
      policeCheck: "",
      workingRights: "",
      ndisModules: "",
      firstAidCPR: "",
      experience: "",
      availability: "",
      resume: "",
      certificates: "",
      references: "",
    },
  });

  const onSubmit = async (data: CareerFormValues) => {
    startTransition(async () => {
      const result = await sendCareerApplication(data);
      if (result.success) {
        toast.success(result.success);
        form.reset();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Career Application
        </CardTitle>
        <p className="text-muted-foreground">
          Please fill out all required information. We'll review your
          application and qualifications thoroughly.
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Personal Information
              </h3>

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

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
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
                      <FormLabel>Phone *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Certifications & Qualifications */}
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
                      <FormLabel>
                        Certificate III in Individual Support *
                      </FormLabel>
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

            {/* Checks & Clearances */}
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

            {/* Training & Modules */}
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

            {/* Experience & Availability */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">
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

            {/* File Uploads */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Supporting Documents
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload your documents or provide links below. Supported formats:
                PDF, DOC, DOCX, JPG, PNG (max 10MB each)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Resume Upload */}
                <div className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Resume/CV
                  </FormLabel>
                  {uploadedFiles.find((f) => f.type === "resume") ? (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800 truncate">
                        {uploadedFiles.find((f) => f.type === "resume")?.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile("resume")}
                        className="ml-auto text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, "resume");
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingFiles.has(`resume-${Date.now()}`)}
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
                        <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {uploadingFiles.has(`resume-${Date.now()}`)
                            ? "Uploading..."
                            : "Click to upload resume"}
                        </p>
                      </div>
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Or paste link to resume"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Certificates Upload */}
                <div className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certificates
                  </FormLabel>
                  {uploadedFiles.find((f) => f.type === "certificates") ? (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800 truncate">
                        {
                          uploadedFiles.find((f) => f.type === "certificates")
                            ?.name
                        }
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile("certificates")}
                        className="ml-auto text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, "certificates");
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingFiles.has(
                          `certificates-${Date.now()}`
                        )}
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
                        <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {uploadingFiles.has(`certificates-${Date.now()}`)
                            ? "Uploading..."
                            : "Click to upload certificates"}
                        </p>
                      </div>
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="certificates"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Or paste link to certificates"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* References Upload */}
                <div className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    References
                  </FormLabel>
                  {uploadedFiles.find((f) => f.type === "references") ? (
                    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800 truncate">
                        {
                          uploadedFiles.find((f) => f.type === "references")
                            ?.name
                        }
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile("references")}
                        className="ml-auto text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, "references");
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingFiles.has(
                          `references-${Date.now()}`
                        )}
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
                        <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {uploadingFiles.has(`references-${Date.now()}`)
                            ? "Uploading..."
                            : "Click to upload references"}
                        </p>
                      </div>
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="references"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Or paste link to references"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending} className="px-8">
                {isPending ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
