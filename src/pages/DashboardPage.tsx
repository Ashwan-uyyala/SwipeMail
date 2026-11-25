import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { LogOut, Mail } from "lucide-react";
import { supabase } from "../lib/supabase";
import { ThemeToggle, useTheme } from "../components/common/ThemeToggle";

export function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

  const displayName =
    user?.user_metadata.full_name ||
    user?.user_metadata.name ||
    user?.email ||
    "Your account";

  return (
    <main className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <header className={`border-b transition-colors duration-500 ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">
              <Mail className="h-5 w-5" />
            </div>
            <span className={`font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>SwipeMail</span>
          </div>

          <div className="flex items-center gap-3">
            <span className={`hidden text-sm sm:block ${isDark ? "text-slate-400" : "text-slate-500"}`}>{displayName}</span>
            <ThemeToggle />
            <button
              type="button"
              onClick={signOut}
              className={`grid h-10 w-10 place-items-center rounded-xl border transition ${
                isDark
                  ? "border-slate-700 bg-slate-800 text-slate-400 hover:text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900"
              }`}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className={`text-3xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
          Welcome, {displayName}
        </h1>
        <p className={`mt-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Google sign-in is ready. The swipe inbox interface will be added next.
        </p>
      </section>
    </main>
  );
}
