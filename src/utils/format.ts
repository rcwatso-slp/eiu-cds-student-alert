import type { Timestamp } from "firebase/firestore";

export const formatDateTime = (
  createdAt?: Timestamp | null,
  submittedAt?: string,
): string => {
  let date: Date | null = null;

  if (createdAt?.toDate) {
    date = createdAt.toDate();
  } else if (submittedAt) {
    date = new Date(submittedAt);
  }

  if (!date || Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

export const formatBooleanLabel = (value: boolean): string => (value ? "Yes" : "No");

export const formatList = (items: string[]): string =>
  items.length > 0 ? items.join(", ") : "None provided";
