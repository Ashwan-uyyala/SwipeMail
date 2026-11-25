import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";
import { ThemeToggle, useTheme } from "../components/common/ThemeToggle";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M21.35 12.23c0-.74-.07-1.45-.19-2.14H12v4.05h5.25a4.49 4.49 0 0 1-1.95 2.95v2.44h3.16c1.85-1.7 2.89-4.2 2.89-7.3Z"/>
      <path fill="#34A853" d="M12 21.75c2.64 0 4.86-.87 6.48-2.36l-3.16-2.44c-.87.59-1.99.94-3.32.94-2.55 0-4.71-1.72-5.48-4.03H3.25v2.51A9.75 9.75 0 0 0 12 21.75Z"/>
      <path fill="#FBBC05" d="M6.52 13.86A5.86 5.86 0 0 1 6.21 12c0-.65.11-1.28.31-1.86V7.63H3.25A9.75 9.75 0 0 0 2.25 12c0 1.58.38 3.07 1 4.37l3.27-2.51Z"/>
      <path fill="#EA4335" d="M12 6.11c1.44 0 2.72.49 3.74 1.45l2.81-2.81A9.38 9.38 0 0 0 12 2.25a9.75 9.75 0 0 0-8.75 5.38l3.27 2.51C7.29 7.83 9.45 6.11 12 6.11Z"/>
    </svg>
  );
}

export function AuthPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/", { replace: true });
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/", { replace: true });
      }
    });

    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function signInWithGoogle() {
    setError("");
    setIsSigningIn(true);

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (signInError) {
      setError(signInError.message);
      setIsSigningIn(false);
    }
  }

  return (
    <main
      className={`relative grid min-h-screen transition-colors duration-500 lg:grid-cols-[1.1fr_0.9fr] ${
        isDark ? "bg-slate-950" : "bg-slate-50"
      }`}
    >
      <div className="absolute right-5 top-5 z-20 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>
      <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.28),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.22),_transparent_35%)]" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/20">
            <Mail className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight">SwipeMail</span>
        </div>

        <div className="relative max-w-xl pb-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200">
            <Sparkles className="h-4 w-4 text-blue-400" />
            A calmer inbox starts here
          </div>
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight">
            Make inbox decisions,
            <span className="block text-blue-400">one swipe at a time.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Keep what matters, archive distractions, and move through email with speed.
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-sm text-slate-400">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          Secure Google authentication powered by Supabase
        </div>
      </section>

      <section
        className={`flex min-h-screen items-center justify-center px-6 py-20 transition-colors duration-500 sm:py-12 ${
          isDark ? "bg-slate-950" : "bg-slate-50"
        }`}
      >
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white">
              <Mail className="h-5 w-5" />
            </div>
            <span className={`text-xl font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>SwipeMail</span>
          </div>

          <div
            className={`rounded-[28px] border p-7 shadow-xl transition-colors duration-500 sm:p-9 ${
              isDark
                ? "border-slate-800 bg-slate-900 shadow-black/20"
                : "border-slate-200 bg-white shadow-slate-900/5"
            }`}
          >
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Welcome
              </p>
              <h2 className={`text-3xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-950"}`}>
                Sign in to SwipeMail
              </h2>
              <p className={`mt-3 leading-7 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Connect your Google account to start managing your inbox.
              </p>
            </div>

            {error && (
              <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={isSigningIn}
              className={`flex h-14 w-full items-center justify-center gap-3 rounded-2xl border px-5 text-[15px] font-semibold shadow-sm transition duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
                isDark
                  ? "border-slate-700 bg-slate-800 text-slate-100 hover:border-slate-600 hover:bg-slate-700"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {isSigningIn ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                  Connecting...
                </>
              ) : (
                <>
                  <GoogleIcon />
                  Continue with Google
                  <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />
                </>
              )}
            </button>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              By continuing, you agree to connect your account securely through Google.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
