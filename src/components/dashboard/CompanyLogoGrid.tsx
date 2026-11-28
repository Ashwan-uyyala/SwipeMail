import type { Email } from "../../types/email";
import { CompanyLogo } from "../common/CompanyLogo";

interface CompanyLogoGridProps {
  emails: Email[];
  selected: string;
  onSelect: (company: string) => void;
}

export function CompanyLogoGrid({ emails, selected, onSelect }: CompanyLogoGridProps) {
  const companies = Array.from(new Set(emails.map((email) => email.companyName))).map((name) => {
    const companyEmails = emails.filter((email) => email.companyName === name);
    return {
      name,
      initial: companyEmails[0].companyInitial,
      count: companyEmails.length,
      unread: companyEmails.filter((email) => email.isUnread).length,
    };
  });

  const options = [{ name:"All", initial:"All", count:emails.length, unread:emails.filter((email) => email.isUnread).length }, ...companies];

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">Explore your senders</h2>
          <p className="mt-1 text-xs text-slate-400">Filter the swipe deck by company</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {options.map((company) => (
          <button
            type="button"
            key={company.name}
            onClick={() => onSelect(company.name)}
            className={`company-card flex h-[65px] touch-manipulation items-center rounded-2xl border px-3 text-left transition-[border-color,box-shadow,background-color] duration-150 active:scale-100 ${
              selected === company.name
                ? "border-orange-400 bg-orange-50 shadow-sm dark:border-orange-400/50"
                : "border-slate-200/80 bg-white hover:border-slate-300 dark:border-white/[0.08]"
            }`}
          >
            {company.name === "All" ? (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-xs font-bold text-white dark:bg-white/[0.08] dark:text-slate-200">
                All
              </div>
            ) : (
              <CompanyLogo
                senderName={emails.find((email) => email.companyName === company.name)?.senderName}
                senderEmail={emails.find((email) => email.companyName === company.name)?.senderEmail}
                companyName={company.name}
                size="sm"
              />
            )}
            <div className="ml-2.5 min-w-0">
              <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">{company.name === "All" ? "All senders" : company.name}</p>
              <p className="mt-1 text-[10px] text-slate-400">{company.count} email{company.count === 1 ? "" : "s"} · {company.unread} unread</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
