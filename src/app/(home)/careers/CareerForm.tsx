"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

import {
  careerSchema,
  CareerFormValues,
} from "@/lib/validations/career.schema";
import { sendCareerApplication } from "./actions";
import PersonalInfoSection from "./_components/PersonalInfoSection";
import CertificationsSection from "./_components/CertificationsSection";
import ChecksSection from "./_components/ChecksSection";
import TrainingSection from "./_components/TrainingSection";
import ExperienceSection from "./_components/ExperienceSection";
import FileUploadSection from "./_components/FileUploadSection";
import { Award } from "lucide-react";

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
          Please fill out all required information. We&apos;ll review your
          application and qualifications thoroughly.
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <PersonalInfoSection form={form} />
            <CertificationsSection form={form} />
            <ChecksSection form={form} />
            <TrainingSection form={form} />
            <ExperienceSection form={form} />
            <FileUploadSection
              form={form}
              uploadedFiles={uploadedFiles}
              uploadingFiles={uploadingFiles}
              handleFileUpload={handleFileUpload}
              removeFile={removeFile}
            />

            <div className="flex justify-end pt-4">
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
