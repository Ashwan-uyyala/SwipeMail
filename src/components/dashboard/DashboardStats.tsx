import { Inbox, MailOpen, Star, Clock3 } from "lucide-react";
import { mockEmails } from "../../data/mockEmails";
import type { EmailFilter } from "../../hooks/useMockEmails";

interface DashboardStatsProps {
  selected: EmailFilter;
  onSelect: (filter: EmailFilter) => void;
}

export function DashboardStats({ selected, onSelect }: DashboardStatsProps) {
  const stats = [
    { label:"All Emails", filter:"all" as const, value:String(mockEmails.length), icon:Inbox, color:"text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10" },
    { label:"Important", filter:"important" as const, value:String(mockEmails.filter((email) => email.isImportant).length), icon:Star, color:"text-amber-600 bg-amber-50 dark:bg-amber-500/10" },
    { label:"Unread", filter:"unread" as const, value:String(mockEmails.filter((email) => email.isUnread).length), icon:MailOpen, color:"text-blue-600 bg-blue-50 dark:bg-blue-500/10" },
    { label:"Received", filter:"received" as const, value:String(mockEmails.length), icon:Clock3, color:"text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" },
  ];
  return (
    <section className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
      {stats.map(({ label, filter, value, icon:Icon, color }) => (
        <button
          type="button"
          key={label}
          onClick={() => onSelect(filter)}
          className={`flex min-h-[82px] items-center rounded-2xl border px-3.5 text-left transition md:px-4 ${
            selected === filter
              ? "border-indigo-300 bg-indigo-50/60 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-500/10"
              : "border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
          }`}
        >
          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="ml-3">
            <p className="text-lg font-bold leading-none text-slate-900 dark:text-white">{value}</p>
            <p className="mt-1.5 text-[11px] font-medium text-slate-400">{label}</p>
          </div>
        </button>
      ))}
    </section>
  );
}
