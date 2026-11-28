export interface Email {
  id: string;
  senderName: string;
  senderEmail: string;
  companyName: string;
  companyInitial: string;
  subject: string;
  summary: string;
  body: string;
  receivedAt: string;
  isUnread: boolean;
  isImportant: boolean;
  category?: string;
  labels: string[];
}

export type SwipeAction = "spam" | "keep" | "category" | "trash";
export type EmailFilter =
  | "all"
  | "important"
  | "unread"
  | "received"
  | `company:${string}`
  | `category:${string}`;
