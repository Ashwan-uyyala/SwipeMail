import { useEffect, useState, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { DashboardPage } from "../pages/DashboardPage";
import { AuthPage } from "../pages/AuthPage";
import { supabase } from "../lib/supabase";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      </main>
    );
  }

  return session ? <>{children}</> : <Navigate to="/auth" replace />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
