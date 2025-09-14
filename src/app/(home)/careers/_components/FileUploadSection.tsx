"use client";

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
import { Upload, FileText, Award, Shield, X, CheckCircle } from "lucide-react";

interface UploadedFile {
  name: string;
  url: string;
  type: "resume" | "certificates" | "references";
}

interface FileUploadSectionProps {
  form: UseFormReturn<CareerFormValues>;
  uploadedFiles: UploadedFile[];
  uploadingFiles: Set<string>;
  handleFileUpload: (
    file: File,
    type: "resume" | "certificates" | "references"
  ) => void;
  removeFile: (type: "resume" | "certificates" | "references") => void;
}

export default function FileUploadSection({
  form,
  uploadedFiles,
  uploadingFiles,
  handleFileUpload,
  removeFile,
}: FileUploadSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Upload className="h-4 w-4" />
        Supporting Documents
      </h3>
      <p className="text-sm text-muted-foreground">
        Upload your documents or provide links below. Supported formats: PDF,
        DOC, DOCX, JPG, PNG (max 10MB each)
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
                  <Input placeholder="Or paste link to resume" {...field} />
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
                {uploadedFiles.find((f) => f.type === "certificates")?.name}
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
                disabled={uploadingFiles.has(`certificates-${Date.now()}`)}
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
                {uploadedFiles.find((f) => f.type === "references")?.name}
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
                disabled={uploadingFiles.has(`references-${Date.now()}`)}
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
                  <Input placeholder="Or paste link to references" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
