import type { User } from "@supabase/supabase-js";
import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "../common/ThemeToggle";
import { MobileMenuButton } from "./AppSidebar";

interface AppHeaderProps {
  user: User | null;
  onMenuOpen: () => void;
}

export function AppHeader({ user, onMenuOpen }: AppHeaderProps) {
  const displayName = user?.user_metadata.full_name || user?.user_metadata.name || user?.email || "Your account";
  const email = user?.email || "";
  const avatar = user?.user_metadata.avatar_url || user?.user_metadata.picture;
  return (
    <header className="dark-panel sticky top-0 z-20 flex h-[76px] items-center border-b border-black/[0.07] bg-[#f7f5f0]/90 px-4 backdrop-blur-xl md:px-8 lg:px-10 dark:border-white/[0.07]">
      <MobileMenuButton onClick={onMenuOpen} />
      <div className="ml-3 lg:ml-0">
        <h1 className="text-[20px] font-bold tracking-tight text-slate-950 dark:text-white">Your Inbox</h1>
        <p className="hidden text-xs text-slate-400 sm:block">A smarter way to manage your emails.</p>
      </div>
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <div className="relative hidden xl:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input aria-label="Search emails" placeholder="Search emails" className="h-10 w-56 rounded-xl border border-black/[0.08] bg-white/60 pl-9 pr-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 dark:border-white/[0.08] dark:bg-white/[0.04]" />
        </div>
        <button type="button" aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-900">
          <Bell className="h-[18px] w-[18px]" />
        </button>
        <ThemeToggle />
        <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-3 sm:flex dark:border-slate-800">
          {avatar ? (
            <img src={avatar} alt="" className="h-9 w-9 rounded-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-full bg-orange-100 text-xs font-bold text-orange-700 dark:bg-white/[0.08] dark:text-orange-300">{displayName.charAt(0).toUpperCase()}</div>
          )}
          <div className="hidden max-w-36 md:block">
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">{displayName}</p>
            <p className="truncate text-[10px] text-slate-400">{email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
