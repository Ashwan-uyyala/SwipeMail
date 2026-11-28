import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import type { SwipeAction } from "../../types/email";

export function SwipeControls({ onAction, disabled }: { onAction: (action: SwipeAction) => void; disabled: boolean }) {
  const controls = [
    { action:"spam" as const, tooltip:"Archive", icon:ArrowLeft, color:"text-red-500" },
    { action:"keep" as const, tooltip:"Keep", icon:ArrowRight, color:"text-emerald-500" },
    { action:"category" as const, tooltip:"Important", icon:ArrowUp, color:"text-amber-500" },
    { action:"trash" as const, tooltip:"Skip", icon:ArrowDown, color:"text-blue-500" },
  ];
  return (
    <div className="relative z-40 mt-5 flex h-14 items-center justify-center gap-3 overflow-visible sm:gap-4" role="group" aria-label="Swipe actions">
      {controls.map(({ action, tooltip, icon:Icon, color }) => (
        <div key={action} className="group relative overflow-visible">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onAction(action)}
            className={`dark-panel grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white shadow-[0_6px_18px_-8px_rgba(15,23,42,.28)] transition duration-200 disabled:pointer-events-none disabled:opacity-40 sm:h-12 sm:w-12 ${color} hover:-translate-y-1 hover:border-slate-300 hover:shadow-md active:scale-95 dark:border-white/[0.08]`}
            aria-label={tooltip}
          >
            <Icon className="h-[19px] w-[19px]" strokeWidth={2} />
          </button>
          <div className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-50 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 sm:block">
            {tooltip}
            <span className="absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-slate-950" />
          </div>
        </div>
      ))}
    </div>
  );
}
