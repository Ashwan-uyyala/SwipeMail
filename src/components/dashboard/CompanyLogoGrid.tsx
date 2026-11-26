import { mockEmails } from "../../data/mockEmails";
import { CompanyLogo } from "../common/CompanyLogo";

interface CompanyLogoGridProps {
  selected: string;
  onSelect: (company: string) => void;
}

export function CompanyLogoGrid({ selected, onSelect }: CompanyLogoGridProps) {
  const companies = Array.from(new Set(mockEmails.map((email) => email.companyName))).map((name) => {
    const emails = mockEmails.filter((email) => email.companyName === name);
    return {
      name,
      initial: emails[0].companyInitial,
      count: emails.length,
      unread: emails.filter((email) => email.isUnread).length,
    };
  });

  const options = [{ name:"All", initial:"All", count:mockEmails.length, unread:mockEmails.filter((email) => email.isUnread).length }, ...companies];

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
            className={`flex h-[74px] touch-manipulation items-center rounded-2xl border px-3 text-left transition-[border-color,box-shadow,background-color] duration-150 active:scale-100 ${
              selected === company.name
                ? "border-indigo-300 bg-indigo-50/70 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-500/10"
                : "border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
            }`}
          >
            {company.name === "All" ? (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                All
              </div>
            ) : (
              <CompanyLogo
                senderName={mockEmails.find((email) => email.companyName === company.name)?.senderName}
                senderEmail={mockEmails.find((email) => email.companyName === company.name)?.senderEmail}
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
