export const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PENDING", label: "Pending" },
  { value: "DISCHARGED", label: "Discharged" },
] as const;

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "NON_BINARY", label: "Non-binary" },
  { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
] as const;

export const COMMUNICATION_METHOD_OPTIONS = [
  { value: "VERBAL", label: "Verbal" },
  { value: "WRITTEN", label: "Written" },
  { value: "VISUAL", label: "Visual" },
  { value: "SIGN_LANGUAGE", label: "Sign Language" },
  { value: "ASSISTIVE_TECHNOLOGY", label: "Assistive Technology" },
] as const;