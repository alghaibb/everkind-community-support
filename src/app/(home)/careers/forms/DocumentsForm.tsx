"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormLabel } from "@/components/ui/form";
import { CareerFormStepProps } from "@/app/(home)/careers/steps";
import {
  documentsSchema,
  DocumentsValues,
} from "@/lib/validations/careers/career.schema";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface UploadedFile {
  name: string;
  url: string;
  type: "resume" | "certificates";
  id: string;
  originalName: string;
}

export default function DocumentsForm({
  careerData,
  setCareerData,
}: CareerFormStepProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());
  const [removingFiles, setRemovingFiles] = useState<Set<string>>(new Set());

  const form = useForm<DocumentsValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      resume: careerData.resume || "",
      certificates: Array.isArray(careerData.certificates)
        ? careerData.certificates.filter(
            (cert): cert is string => cert !== undefined
          )
        : [],
    },
  });

  // Initialize uploadedFiles from saved data
  useEffect(() => {
    const initializeUploadedFiles = () => {
      const initialFiles: UploadedFile[] = [];

      // Add resume if it exists
      if (careerData.resume && typeof careerData.resume === "string") {
        initialFiles.push({
          name: careerData.resume.split("/").pop() || "resume",
          url: careerData.resume,
          type: "resume",
          id: `resume-${Date.now()}`,
          originalName: "Resume",
        });
      }

      // Add certificates if they exist
      if (Array.isArray(careerData.certificates)) {
        careerData.certificates.forEach((cert, index) => {
          if (cert && typeof cert === "string") {
            initialFiles.push({
              name: cert.split("/").pop() || `certificate-${index + 1}`,
              url: cert,
              type: "certificates",
              id: `certificate-${Date.now()}-${index}`,
              originalName: `Certificate ${index + 1}`,
            });
          }
        });
      }

      setUploadedFiles(initialFiles);
    };

    initializeUploadedFiles();
  }, [careerData.resume, careerData.certificates]);

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;

      setCareerData({
        ...careerData,
        resume: values.resume,
        certificates:
          values.certificates?.filter(
            (cert): cert is string => cert !== undefined
          ) || [],
      });
    });
    return unsubscribe;
  }, [form, careerData, setCareerData]);

  const handleFileUpload = async (
    file: File,
    type: "resume" | "certificates"
  ) => {
    if (!file) return;

    const fileId = `${type}-${Date.now()}-${file.name}`;
    setUploadingFiles((prev) => new Set(prev).add(fileId));

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Set folder based on file type
      const folder =
        type === "resume" ? "careers/resumes" : "careers/certificates";
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const uploadedFile: UploadedFile = {
          name: result.fileName || file.name,
          url: result.url,
          type,
          id: fileId,
          originalName: file.name,
        };

        setUploadedFiles((prev) => [...prev, uploadedFile]);

        // Update form values
        if (type === "resume") {
          form.setValue("resume", result.url);
        } else if (type === "certificates") {
          const currentCertificates = form.getValues("certificates") || [];
          form.setValue("certificates", [...currentCertificates, result.url]);
        }

        toast.success(`${file.name} uploaded successfully!`);
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const removeFile = async (
    fileId: string,
    type: "resume" | "certificates"
  ) => {
    const fileToRemove = uploadedFiles.find((f) => f.id === fileId);

    // Add file to removing state
    setRemovingFiles((prev) => new Set([...prev, fileId]));

    if (fileToRemove) {
      try {
        // Delete from blob storage
        const deleteResponse = await fetch(
          `/api/upload?url=${encodeURIComponent(fileToRemove.url)}`,
          {
            method: "DELETE",
          }
        );

        const deleteResult = await deleteResponse.json();

        if (!deleteResult.success) {
          console.error(
            "Failed to delete file from storage:",
            deleteResult.error
          );
          toast.error("File removed from form but may still exist in storage");
        }
      } catch (error) {
        console.error("Error deleting file from storage:", error);
        toast.error("File removed from form but may still exist in storage");
      }
    }

    // Remove from local state
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));

    if (type === "resume") {
      form.setValue("resume", "");
    } else if (type === "certificates") {
      const currentCertificates = form.getValues("certificates") || [];
      if (fileToRemove) {
        const updatedCertificates = currentCertificates.filter(
          (url) => url !== fileToRemove.url
        );
        form.setValue("certificates", updatedCertificates);
      }
    }

    // Remove from removing state
    setRemovingFiles((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fileId);
      return newSet;
    });

    toast.success("File removed successfully");
  };

  const getFilesByType = (type: "resume" | "certificates") => {
    return uploadedFiles.filter((f) => f.type === type);
  };

  const isUploading = (type: "resume" | "certificates") => {
    return Array.from(uploadingFiles).some((id) => id.startsWith(`${type}-`));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Upload className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Documents & Files</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload your resume and supporting documents. Files should be in PDF
          format.
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          {/* Resume Upload */}
          <div className="space-y-2">
            <FormLabel className="text-base font-medium">Resume</FormLabel>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              {getFilesByType("resume").length > 0 ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">
                        {getFilesByType("resume")[0]?.originalName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Resume uploaded
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={removingFiles.has(
                        getFilesByType("resume")[0]?.id || ""
                      )}
                      onClick={() =>
                        removeFile(
                          getFilesByType("resume")[0]?.id || "",
                          "resume"
                        ).catch(console.error)
                      }
                    >
                      {removingFiles.has(
                        getFilesByType("resume")[0]?.id || ""
                      ) ? (
                        <Spinner variant="circle" className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Upload your resume (PDF format recommended)
                    </p>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "resume");
                      }}
                      disabled={isUploading("resume")}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Certificates Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FormLabel className="text-base font-medium">
                Certificates & Qualifications
              </FormLabel>
              {getFilesByType("certificates").length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {getFilesByType("certificates").length} file(s) uploaded
                </span>
              )}
            </div>

            {/* Display uploaded certificates */}
            {getFilesByType("certificates").length > 0 && (
              <div className="space-y-2">
                {getFilesByType("certificates").map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-muted/30 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">
                          {file.originalName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Certificate uploaded
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={removingFiles.has(file.id)}
                        onClick={() =>
                          removeFile(file.id, "certificates").catch(
                            console.error
                          )
                        }
                      >
                        {removingFiles.has(file.id) ? (
                          <Spinner variant="circle" className="h-3 w-3" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload new certificate */}
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {getFilesByType("certificates").length === 0
                      ? "Upload your certificates and qualifications"
                      : "Add another certificate or qualification"}
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, "certificates");
                    }}
                    disabled={isUploading("certificates")}
                    className="max-w-xs mx-auto"
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
