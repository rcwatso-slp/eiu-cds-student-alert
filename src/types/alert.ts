import type { Timestamp } from "firebase/firestore";

export type Severity = "Low" | "Moderate" | "High" | "Critical";

export interface AlertRecord {
  id?: string;
  facultyName: string;
  facultyEmail: string;
  course: string;
  semester: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  concernType: string;
  severity: Severity;
  description: string;
  evidence: string;
  addressedStudent: boolean;
  actionTaken: string;
  followUpRequested: string;
  coreFunctionAreas: string[];
  timeSensitive: boolean;
  urgencyExplanation: string;
  createdAt?: Timestamp | null;
  submittedAt: string;
  userUid: string;
  userEmail: string;
  status?: "new";
}

export interface AlertFormValues {
  facultyName: string;
  facultyEmail: string;
  course: string;
  semester: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  concernType: string;
  severity: "" | Severity;
  description: string;
  evidence: string;
  addressedStudent: "" | "yes" | "no";
  actionTaken: string;
  followUpRequested: string;
  coreFunctionAreas: string[];
  timeSensitive: "" | "yes" | "no";
  urgencyExplanation: string;
}

export type AlertFormErrors = Partial<Record<keyof AlertFormValues, string>>;
