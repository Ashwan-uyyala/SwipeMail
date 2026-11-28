import { useEffect } from "react";
import { ExternalLink, X } from "lucide-react";
import type { Email } from "../../types/email";
import { CompanyLogo } from "../common/CompanyLogo";

export function EmailDetailsModal({ email, onClose }: { email: Email | null; onClose: () => void }) {
  useEffect(() => {
    if (!email) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [email, onClose]);

  if (!email) return null;
  const date = new Intl.DateTimeFormat("en-US", { dateStyle:"full", timeStyle:"short" }).format(new Date(email.receivedAt));

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/35 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Email details" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="dark-panel max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] border border-slate-200 bg-white shadow-2xl sm:rounded-[28px] dark:border-white/[0.08]">
        <div className="dark-panel sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur dark:border-white/[0.08] sm:px-7">
          <p className="text-sm font-bold text-slate-900 dark:text-white">Email details</p>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-6 sm:px-7">
          <div className="flex items-center">
            <CompanyLogo senderName={email.senderName} senderEmail={email.senderEmail} companyName={email.companyName} size="lg" />
            <div className="ml-3">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{email.senderName}</p>
              <p className="mt-0.5 text-xs text-slate-400">{email.senderEmail}</p>
            </div>
          </div>
          <h2 className="mt-6 text-2xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white">{email.subject}</h2>
          <p className="mt-2 text-xs text-slate-400">{date}</p>
          <div className="dark-panel mt-6 whitespace-pre-line rounded-2xl border border-slate-100 bg-slate-50 p-5 text-[14px] leading-7 text-slate-600 dark:border-white/[0.07] dark:text-slate-300">{email.body}</div>
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => window.open(`https://mail.google.com/mail/u/0/#all/${encodeURIComponent(email.id)}`, "_blank", "noopener,noreferrer")}
              className="flex h-11 items-center gap-2 rounded-xl bg-orange-500 px-4 text-xs font-bold text-white transition hover:bg-orange-600 active:scale-[.98]"
            >
              Open in Gmail <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
