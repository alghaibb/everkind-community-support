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
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { CAREER_DOCUMENT_FIELDS } from "../constants";

// DocumentField interface now matches the constants structure
type DocumentField = (typeof CAREER_DOCUMENT_FIELDS)[number];

// Document fields now imported from constants

interface UploadState {
  [key: string]: {
    uploading: boolean;
    removing: boolean;
    fileName?: string;
  };
}

export default function DocumentsForm({
  careerData,
  setCareerData,
}: CareerFormStepProps) {
  const [uploadStates, setUploadStates] = useState<UploadState>({});

  // Filter documents based on role - only show AHPRA for nurse roles
  const filteredDocumentFields = CAREER_DOCUMENT_FIELDS.filter((field) => {
    if (field.key === "ahpraCertificate") {
      return careerData.role?.includes("Nurse");
    }
    return true;
  });

  const form = useForm<DocumentsValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      resume: careerData.resume || "",
      wwccDocument: careerData.wwccDocument || "",
      ndisDocument: careerData.ndisDocument || "",
      policeCheckDocument: careerData.policeCheckDocument || "",
      firstAidCertificate: careerData.firstAidCertificate || "",
      qualificationCertificate: careerData.qualificationCertificate || "",
      ahpraCertificate: careerData.ahpraCertificate || "",
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

  const handleFileUpload = async (file: File, documentField: DocumentField) => {
    if (!file) return;

    const fieldKey = documentField.key;
    setUploadStates((prev) => ({
      ...prev,
      [fieldKey]: { uploading: true, removing: false },
    }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", documentField.folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        form.setValue(fieldKey, result.url);
        setUploadStates((prev) => ({
          ...prev,
          [fieldKey]: {
            uploading: false,
            removing: false,
            fileName: result.fileName || file.name,
          },
        }));
        toast.success(`${documentField.label} uploaded successfully!`);
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(`Failed to upload ${documentField.label}. Please try again.`);
      setUploadStates((prev) => ({
        ...prev,
        [fieldKey]: { uploading: false, removing: false },
      }));
    }
  };

  const removeFile = async (documentField: DocumentField) => {
    const fieldKey = documentField.key;
    const currentUrl = form.getValues(fieldKey);

    if (!currentUrl) return;

    setUploadStates((prev) => ({
      ...prev,
      [fieldKey]: { uploading: false, removing: true },
    }));

    try {
      const deleteResponse = await fetch(
        `/api/upload?url=${encodeURIComponent(currentUrl)}`,
        { method: "DELETE" }
      );

      const deleteResult = await deleteResponse.json();
      if (!deleteResult.success) {
        console.error(
          "Failed to delete file from storage:",
          deleteResult.error
        );
      }
    } catch (error) {
      console.error("Error deleting file from storage:", error);
    }

    form.setValue(fieldKey, "");
    setUploadStates((prev) => ({
      ...prev,
      [fieldKey]: { uploading: false, removing: false, fileName: undefined },
    }));

    toast.success(`${documentField.label} removed successfully`);
  };

  const getFileName = (url: string) => {
    return url.split("/").pop() || "Document";
  };

  const isUploaded = (fieldKey: keyof DocumentsValues) => {
    const value = form.getValues(fieldKey);
    return value && value.trim() !== "";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Upload className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Documents & Certificates</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload your documents and certificates. PDF format is recommended for
          best quality.
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          {filteredDocumentFields.map((documentField) => {
            const fieldKey = documentField.key;
            const uploaded = isUploaded(fieldKey);
            const uploading = uploadStates[fieldKey]?.uploading || false;
            const removing = uploadStates[fieldKey]?.removing || false;
            const fileName =
              uploadStates[fieldKey]?.fileName ||
              getFileName(form.getValues(fieldKey) || "");

            return (
              <div key={fieldKey} className="space-y-2">
                <div className="flex items-center gap-2">
                  <FormLabel className="text-base font-medium">
                    {documentField.label}
                    {documentField.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </FormLabel>
                  {documentField.required && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {documentField.description}
                </p>

                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  {uploaded ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-medium">{fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            {documentField.label} uploaded
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={removing}
                          onClick={() => removeFile(documentField)}
                        >
                          {removing ? (
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
                          Upload your {documentField.label.toLowerCase()}
                        </p>
                        <Input
                          type="file"
                          accept={documentField.acceptedFormats}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, documentField);
                          }}
                          disabled={uploading}
                          className="max-w-xs mx-auto"
                        />
                        {uploading && (
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <Spinner variant="circle" className="h-4 w-4" />
                            <span className="text-sm text-muted-foreground">
                              Uploading...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Form>
    </div>
  );
}
