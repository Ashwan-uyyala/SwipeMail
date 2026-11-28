import { useCallback, useEffect, useMemo, useState } from "react";
import { getGoogleProviderToken, supabase } from "../lib/supabase";
import { gmailService } from "../services/gmailService";
import type { Email, EmailFilter, SwipeAction } from "../types/email";

export function useInbox() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(() => getGoogleProviderToken());
  const [sessionResolved, setSessionResolved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<EmailFilter>("all");
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [actions, setActions] = useState<Record<string, SwipeAction>>({});

  useEffect(() => {
    let active = true;
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      setAccessToken(session?.provider_token ?? (event === "SIGNED_OUT" ? null : getGoogleProviderToken()));
      setSessionResolved(true);
    });

    supabase.auth.getSession().then(({ data: sessionData, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError(sessionError.message);
      setAccessToken(sessionData.session?.provider_token ?? getGoogleProviderToken());
      setSessionResolved(true);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!sessionResolved) return;
    if (!accessToken) {
      setEmails([]);
      setError(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    setEmails([]);
    setReviewed([]);
    setActions({});
    gmailService.fetchMessages(accessToken)
      .then((inbox) => {
        if (active) setEmails(inbox);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load Gmail messages.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken, refreshVersion, sessionResolved]);

  const filtered = useMemo(() => {
    if (selectedFilter === "important") return emails.filter((email) => email.isImportant);
    if (selectedFilter === "unread") return emails.filter((email) => email.isUnread);
    if (selectedFilter === "received") return [...emails].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
    if (selectedFilter.startsWith("company:")) {
      const company = selectedFilter.slice("company:".length);
      return emails.filter((email) => email.companyName === company);
    }
    if (selectedFilter.startsWith("category:")) {
      const category = selectedFilter.slice("category:".length).toLowerCase();
      return emails.filter((email) =>
        [email.category, ...email.labels].some((value) => value?.toLowerCase() === category),
      );
    }
    return emails;
  }, [emails, selectedFilter]);

  const visible = filtered.filter((email) => !reviewed.includes(email.id));
  const current = visible[0] ?? null;

  const selectFilter = useCallback((filter: EmailFilter) => {
    setSelectedFilter(filter);
  }, []);

  const performAction = useCallback((email: Email, action: SwipeAction) => {
    setActions((currentActions) => ({ ...currentActions, [email.id]: action }));
    setReviewed((currentReviewed) => currentReviewed.includes(email.id) ? currentReviewed : [...currentReviewed, email.id]);
  }, []);

  const reset = useCallback(() => {
    setReviewed([]);
    setActions({});
  }, []);

  const refresh = useCallback(() => {
    setRefreshVersion((version) => version + 1);
  }, []);

  const sender = selectedFilter.startsWith("company:")
    ? selectedFilter.slice("company:".length)
    : "All";

  return {
    emails,
    filtered,
    visible,
    current,
    sender,
    selectedFilter,
    reviewed,
    actions,
    loading,
    error,
    connected: Boolean(accessToken),
    selectFilter,
    performAction,
    reset,
    refresh,
  };
}
