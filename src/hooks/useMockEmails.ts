import { useCallback, useMemo, useState } from "react";
import { mockEmails } from "../data/mockEmails";
import type { Email } from "../types/email";

export type SwipeAction = "spam" | "keep" | "category" | "trash";
export type EmailFilter = "all" | "important" | "unread" | "received" | `company:${string}`;

export function useMockEmails() {
  const [selectedFilter, setSelectedFilter] = useState<EmailFilter>("all");
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [actions, setActions] = useState<Record<string, SwipeAction>>({});

  const filtered = useMemo(() => {
    if (selectedFilter === "important") return mockEmails.filter((email) => email.isImportant);
    if (selectedFilter === "unread") return mockEmails.filter((email) => email.isUnread);
    if (selectedFilter === "received") return [...mockEmails].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
    if (selectedFilter.startsWith("company:")) {
      const company = selectedFilter.slice("company:".length);
      return mockEmails.filter((email) => email.companyName === company);
    }
    return mockEmails;
  }, [selectedFilter]);

  const visible = filtered.filter((email) => !reviewed.includes(email.id));
  const current = visible[0] ?? null;

  const selectFilter = useCallback((filter: EmailFilter) => {
    setSelectedFilter(filter);
  }, []);

  const performAction = useCallback((email: Email, action: SwipeAction) => {
    setActions((currentActions) => ({ ...currentActions, [email.id]: action }));
    setReviewed((currentReviewed) => [...currentReviewed, email.id]);
  }, []);

  const reset = useCallback(() => {
    setReviewed([]);
    setActions({});
  }, []);

  const sender = selectedFilter.startsWith("company:")
    ? selectedFilter.slice("company:".length)
    : "All";

  return { filtered, visible, current, sender, selectedFilter, reviewed, actions, selectFilter, performAction, reset };
}
