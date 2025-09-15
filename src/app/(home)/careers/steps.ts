import { CareerFormValues } from "../../../lib/validations/careers/career.schema";

export interface CareerFormStepProps {
  careerData: Partial<CareerFormValues>;
  setCareerData: (data: Partial<CareerFormValues>) => void;
}

export const careerSteps: {
  title: string;
  description: string;
  key: string;
}[] = [
    {
      title: "Personal Information",
      description: "Tell us about yourself",
      key: "personal-info",
    },
    {
      title: "Certifications",
      description: "Your qualifications and certifications",
      key: "certifications",
    },
    {
      title: "Checks & Clearances",
      description: "Required background checks and clearances",
      key: "checks",
    },
    {
      title: "Training & Experience",
      description: "Your training background and relevant experience",
      key: "training-experience",
    },
    {
      title: "Documents",
      description: "Upload your resume and supporting documents",
      key: "documents",
    },
  ];
