import {
  Archive, CircleHelp, Home, Inbox, LogOut, Mail, Menu, Settings,
  ShieldAlert, Sparkles, Trash2, X,
} from "lucide-react";

const navigation = [
  { label:"Home", icon:Home, active:true },
  { label:"All Emails", icon:Inbox },
  { label:"Important", icon:Sparkles },
  { label:"Custom Categories", icon:Sparkles },
  { label:"Archived", icon:Archive },
  { label:"Spam", icon:ShieldAlert },
  { label:"Trash", icon:Trash2 },
];

interface AppSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  onSignOut: () => void;
}

export function AppSidebar({ mobileOpen, onMobileClose, onSignOut }: AppSidebarProps) {
  const content = (
    <>
      <div className="flex h-20 items-center px-6">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <Mail className="h-[18px] w-[18px]" />
        </div>
        <div className="ml-3">
          <p className="text-[15px] font-bold tracking-tight text-slate-950 dark:text-white">SwipeMail</p>
          <p className="mt-0.5 text-[10px] font-medium text-slate-400">Your inbox, simplified.</p>
        </div>
        <button type="button" onClick={onMobileClose} className="ml-auto lg:hidden" aria-label="Close menu">
          <X className="h-5 w-5 text-slate-500" />
        </button>
      </div>

      <nav className="mt-3 flex-1 px-3">
        {navigation.map(({ label, icon:Icon, active }) => (
          <button
            key={label}
            type="button"
            className={`mb-1 flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition ${
              active
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-100 px-3 py-4 dark:border-slate-800">
        <button type="button" className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[13px] font-medium text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800">
          <Settings className="h-[17px] w-[17px]" /> Settings
        </button>
        <button type="button" className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[13px] font-medium text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800">
          <CircleHelp className="h-[17px] w-[17px]" /> Help
        </button>
        <button type="button" onClick={onSignOut} className="mt-2 flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[13px] font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10">
          <LogOut className="h-[17px] w-[17px]" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[238px] flex-col border-r border-slate-200/80 bg-white lg:flex dark:border-slate-800 dark:bg-slate-950">
        {content}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm" onClick={onMobileClose} aria-label="Close menu" />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col bg-white shadow-2xl dark:bg-slate-950">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" aria-label="Open menu">
      <Menu className="h-5 w-5" />
    </button>
  );
}
