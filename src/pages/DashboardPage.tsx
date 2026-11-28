import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { AppSidebar } from "../components/layout/AppSidebar";
import { AppHeader } from "../components/layout/AppHeader";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { CompanyLogoGrid } from "../components/dashboard/CompanyLogoGrid";
import { SwipeDeck } from "../components/swipe/SwipeDeck";
import { EmailDetailsModal } from "../components/swipe/EmailDetailsModal";
import { useInbox } from "../hooks/useInbox";
import type { Email, EmailFilter } from "../types/email";

export function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const cardSectionRef = useRef<HTMLElement | null>(null);
  const emailState = useInbox();
  const [connectionError, setConnectionError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  }

  async function connectGmail() {
    setConnectionError("");
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
        scopes: "openid email profile https://www.googleapis.com/auth/gmail.readonly",
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (authError) setConnectionError(authError.message);
  }

  function selectFilter(filter: EmailFilter) {
    emailState.selectFilter(filter);
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        cardSectionRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
      }, 40);
    });
  }

  const sectionHeading = emailState.selectedFilter === "all"
    ? "All Emails"
    : emailState.selectedFilter === "important"
      ? "Important Emails"
      : emailState.selectedFilter === "unread"
        ? "Unread Emails"
        : emailState.selectedFilter === "received"
          ? "Received Emails"
        : emailState.selectedFilter.startsWith("category:")
          ? `${emailState.selectedFilter.slice("category:".length)} Folder`
          : `${emailState.sender} Emails`;
  const reviewedInCollection = emailState.filtered.filter((email) => emailState.reviewed.includes(email.id)).length;

  return (
    <main className="app-shell min-h-screen min-w-0 overflow-x-hidden bg-[#f3f1ec] text-slate-900 transition-colors duration-500 dark:text-slate-100">
      <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} onSignOut={signOut} />
      <div className="min-h-screen min-w-0 lg:ml-[238px]">
        <AppHeader user={user} onMenuOpen={() => setMobileOpen(true)} />
        <div className="mx-auto min-w-0 max-w-[1180px] px-3 pb-10 pt-4 sm:px-6 md:px-8 lg:px-10">
          <DashboardStats emails={emailState.emails} selected={emailState.selectedFilter} onSelect={selectFilter} />
          <section ref={cardSectionRef} className="dark-panel scroll-mt-[92px] mt-4 rounded-[26px] border border-black/[0.07] bg-white/70 px-3 py-5 shadow-[0_24px_70px_-48px_rgba(15,23,42,.28)] backdrop-blur-sm dark:border-white/[0.07] sm:px-6">
            {emailState.loading ? (
              <div className="flex h-[530px] flex-col items-center justify-center text-center" role="status">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500/25 border-t-orange-500" />
                <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-300">Loading your Gmail inbox…</p>
              </div>
            ) : emailState.error || connectionError ? (
              <div className="flex h-[530px] flex-col items-center justify-center px-4 text-center">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Couldn’t load your Gmail</h2>
                <p role="alert" className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{connectionError || emailState.error}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button type="button" onClick={() => { setConnectionError(""); emailState.refresh(); }} className="h-10 rounded-xl border border-black/10 px-4 text-xs font-bold dark:border-white/10">Try again</button>
                  <button type="button" onClick={connectGmail} className="h-10 rounded-xl bg-orange-500 px-4 text-xs font-bold text-white hover:bg-orange-600">Reconnect Google</button>
                </div>
              </div>
            ) : !emailState.connected ? (
              <div className="flex h-[530px] flex-col items-center justify-center px-4 text-center">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Connect your Gmail inbox</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">Authorize read-only Gmail access to load your real messages into the swipe deck.</p>
                <button type="button" onClick={connectGmail} className="mt-5 h-10 rounded-xl bg-orange-500 px-4 text-xs font-bold text-white hover:bg-orange-600">Connect Gmail</button>
              </div>
            ) : (
              <SwipeDeck
                visible={emailState.visible}
                current={emailState.current}
                reviewedCount={reviewedInCollection}
                total={emailState.filtered.length}
                heading={sectionHeading}
                onAction={emailState.performAction}
                onOpen={setSelectedEmail}
                onReset={emailState.reset}
              />
            )}
          </section>
          <CompanyLogoGrid
            emails={emailState.emails}
            selected={emailState.sender}
            onSelect={(company) => selectFilter(company === "All" ? "all" : `company:${company}`)}
          />
        </div>
      </div>
      <EmailDetailsModal email={selectedEmail} onClose={() => setSelectedEmail(null)} />
    </main>
  );
}
