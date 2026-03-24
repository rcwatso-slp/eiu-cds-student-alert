import type { AlertFormValues, Severity } from "../types/alert";

export const APP_NAME = "EIU CDS Student Alert System";
export const EMAIL_LINK_STORAGE_KEY = "eiu-alert-email-link";

export const ADMIN_EMAILS = ["rcwatso@gmail.com", "angela.anthony@eiu.edu"];

export const EXPLICIT_APPROVED_EMAILS = ["rcwatso@gmail.com", "angela.anthony@eiu.edu"];

export const CONCERN_TYPE_OPTIONS = [
  "Academic Performance",
  "Attendance",
  "Professionalism",
  "Communication",
  "Clinical Skills",
  "Behavior / Conduct",
  "Well-Being Concern",
  "Other",
];

export const SEVERITY_OPTIONS: Severity[] = ["Low", "Moderate", "High", "Critical"];

export const FOLLOW_UP_OPTIONS = [
  "None",
  "Advisor Follow-up",
  "Chair Follow-up",
  "Immediate Contact Requested",
  "Monitoring Only",
  "Other",
];

export const CORE_FUNCTION_AREA_OPTIONS = [
  "Communication",
  "Clinical Reasoning",
  "Professionalism",
  "Documentation",
  "Interpersonal Skills",
  "Time Management",
  "Academic Skills",
  "Other",
];

export const DEFAULT_ALERT_FORM_VALUES: AlertFormValues = {
  facultyName: "",
  facultyEmail: "",
  course: "",
  semester: "",
  studentName: "",
  studentId: "",
  studentEmail: "",
  concernType: "",
  severity: "",
  description: "",
  evidence: "",
  addressedStudent: "",
  actionTaken: "",
  followUpRequested: "",
  coreFunctionAreas: [],
  timeSensitive: "",
  urgencyExplanation: "",
};
