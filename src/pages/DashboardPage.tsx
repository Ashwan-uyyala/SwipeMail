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
import { useMockEmails } from "../hooks/useMockEmails";
import type { Email } from "../types/email";
import type { EmailFilter } from "../hooks/useMockEmails";

export function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const cardSectionRef = useRef<HTMLElement | null>(null);
  const emailState = useMockEmails();

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
          : `${emailState.sender} Emails`;
  const reviewedInCollection = emailState.filtered.filter((email) => emailState.reviewed.includes(email.id)).length;

  return (
    <main className="min-h-screen min-w-0 overflow-x-hidden bg-slate-50 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
      <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} onSignOut={signOut} />
      <div className="min-h-screen min-w-0 lg:ml-[238px]">
        <AppHeader user={user} onMenuOpen={() => setMobileOpen(true)} />
        <div className="mx-auto min-w-0 max-w-[1180px] px-3 pb-10 pt-4 sm:px-6 md:px-8 lg:px-10">
          <DashboardStats selected={emailState.selectedFilter} onSelect={selectFilter} />
          <section ref={cardSectionRef} className="scroll-mt-[92px] mt-6 rounded-[26px] border border-slate-200/80 bg-white px-3 py-5 dark:border-slate-800 dark:bg-slate-900/40 sm:px-6">
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
          </section>
          <CompanyLogoGrid
            selected={emailState.sender}
            onSelect={(company) => selectFilter(company === "All" ? "all" : `company:${company}`)}
          />
        </div>
      </div>
      <EmailDetailsModal email={selectedEmail} onClose={() => setSelectedEmail(null)} />
    </main>
  );
}
