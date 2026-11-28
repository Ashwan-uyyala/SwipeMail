import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { Email, SwipeAction } from "../../types/email";
import { EmailCard } from "./EmailCard";
import { SwipeControls } from "./SwipeControls";

interface SwipeDeckProps {
  visible: Email[];
  current: Email | null;
  reviewedCount: number;
  total: number;
  heading: string;
  onAction: (email: Email, action: SwipeAction) => void;
  onOpen: (email: Email) => void;
  onReset: () => void;
}

export function SwipeDeck({ visible, current, reviewedCount, total, heading, onAction, onOpen, onReset }: SwipeDeckProps) {
  const [isActing, setIsActing] = useState(false);
  const [flyAction, setFlyAction] = useState<SwipeAction | null>(null);

  function performAction(action: SwipeAction) {
    if (!current || isActing) return;
    setIsActing(true);
    setFlyAction(action);
    window.setTimeout(() => {
      onAction(current, action);
      setFlyAction(null);
      setIsActing(false);
    }, 300);
  }

  if (!current) {
    const inboxIsEmpty = total === 0;
    return (
      <div className="flex h-[530px] flex-col items-center justify-center text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-orange-500/10 text-orange-500">
          <RotateCcw className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{inboxIsEmpty ? "No emails in this folder" : "You're all caught up!"}</h3>
        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">{inboxIsEmpty ? "Gmail has no messages in this view right now." : "There are no more emails in this view."}</p>
        {!inboxIsEmpty && (
          <button type="button" onClick={onReset} className="mt-5 h-11 rounded-xl bg-orange-500 px-5 text-xs font-bold text-white shadow-[0_12px_28px_-12px_rgba(249,115,22,.8)] hover:bg-orange-600 active:scale-[.98]">
            Review again
          </button>
        )}
      </div>
    );
  }

  const progress = total === 0 ? 0 : Math.round((reviewedCount / total) * 100);

  return (
    <div>
      <h2 className="mb-3 text-[15px] font-bold text-slate-900 dark:text-white">{heading}</h2>
      <div className="mb-3 flex items-center justify-between px-1 text-[10px] font-semibold text-slate-400">
        <span>Email {Math.min(reviewedCount + 1, total)} of {total}</span>
        <span>{progress}% reviewed</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
        <div className="h-full rounded-full bg-orange-500 transition-all duration-500" style={{ width:`${progress}%` }} />
      </div>
      <div className="email-deck relative mx-auto mt-6 w-full max-w-[430px]">
        <AnimatePresence>
          {visible.slice(0,4).map((email, index) => {
            return (
              <EmailCard
                key={email.id}
                email={email}
                onAction={(_emailItem, action) => performAction(action)}
                onOpen={onOpen}
                behindIndex={index}
                isFront={index === 0}
                flyAction={index === 0 ? flyAction : null}
              />
            );
          })}
        </AnimatePresence>
      </div>
      <SwipeControls onAction={performAction} disabled={isActing} />
    </div>
  );
}
