import { animate, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { Clock3, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Email } from "../../types/email";
import type { SwipeAction } from "../../hooks/useMockEmails";
import { CompanyLogo } from "../common/CompanyLogo";

interface EmailCardProps {
  email: Email;
  onAction: (email: Email, action: SwipeAction) => void;
  onOpen: (email: Email) => void;
  behindIndex?: number;
  isFront?: boolean;
  flyAction?: SwipeAction | null;
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", { month:"short", day:"numeric", year:"numeric", hour:"numeric", minute:"2-digit" }).format(new Date(value));
}

export function EmailCard({ email, onAction, onOpen, behindIndex = 0, isFront = false, flyAction = null }: EmailCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const spamOpacity = useTransform(x, [-160, -55, 0], [1, 0.8, 0]);
  const keepOpacity = useTransform(x, [0, 55, 160], [0, 0.8, 1]);
  const categoryOpacity = useTransform(y, [-160, -55, 0], [1, 0.8, 0]);
  const trashOpacity = useTransform(y, [0, 55, 160], [0, 0.8, 1]);
  const [dragged, setDragged] = useState(false);
  const moved = useRef(false);

  useEffect(() => {
    if (!isFront || !flyAction) return;
    if (flyAction === "keep") animate(x, 520, { duration:.28, ease:"easeIn" });
    if (flyAction === "spam") animate(x, -520, { duration:.28, ease:"easeIn" });
    if (flyAction === "category") animate(y, -580, { duration:.28, ease:"easeIn" });
    if (flyAction === "trash") animate(y, 580, { duration:.28, ease:"easeIn" });
  }, [flyAction, isFront, x, y]);

  if (!isFront) {
    const transforms = [
      { rotate:-3, y:8, scale:.985 },
      { rotate:2, y:16, scale:.97 },
      { rotate:4, y:24, scale:.955 },
    ][Math.min(behindIndex - 1, 2)] || { rotate:-3, y:8, scale:.985 };
    return (
      <motion.article
        aria-hidden="true"
        className="email-card pointer-events-none absolute left-0 right-0 top-0 mx-auto origin-bottom rounded-[24px] border border-slate-200/90 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900"
        initial={false}
        animate={{ y:transforms.y, rotate:transforms.rotate, scale:transforms.scale }}
        style={{ zIndex: 10 - behindIndex }}
      />
    );
  }

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const threshold = 85;
    if (Math.abs(info.offset.x) > threshold) {
      onAction(email, info.offset.x > 0 ? "keep" : "spam");
    } else if (Math.abs(info.offset.y) > threshold) {
      onAction(email, info.offset.y < 0 ? "category" : "trash");
    }
  }

  return (
    <motion.article
      drag
      dragConstraints={{ left:0, right:0, top:0, bottom:0 }}
      dragElastic={0.75}
      onDragStart={() => { moved.current = true; setDragged(true); }}
      onDragEnd={handleDragEnd}
      animate={{ x:0, y:0, rotate:0, scale:1 }}
      exit={{ x:x.get() >= 0 ? 520 : -520, y:y.get() < -85 ? -580 : y.get() > 85 ? 580 : 0, opacity:0, rotate:x.get() >= 0 ? 18 : -18, transition:{ duration:.32 } }}
      transition={{ type:"spring", stiffness:420, damping:32 }}
      style={{ x, y, rotate, zIndex:20, touchAction:"none" }}
      onClick={() => { if (!dragged) onOpen(email); window.setTimeout(() => { moved.current = false; setDragged(false); }, 80); }}
      className="email-card absolute left-0 right-0 top-0 mx-auto cursor-grab overflow-hidden rounded-[24px] border border-slate-200/90 bg-white shadow-[0_20px_45px_-18px_rgba(15,23,42,.32)] active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900"
    >
      <motion.div style={{ opacity:spamOpacity }} className="pointer-events-none absolute left-5 top-5 z-30 rotate-[-8deg] rounded-lg border-2 border-red-500 px-3 py-1.5 text-xs font-black tracking-[.16em] text-red-500">SPAM</motion.div>
      <motion.div style={{ opacity:keepOpacity }} className="pointer-events-none absolute right-5 top-5 z-30 rotate-[8deg] rounded-lg border-2 border-emerald-500 px-3 py-1.5 text-xs font-black tracking-[.16em] text-emerald-500">KEEP</motion.div>
      <motion.div style={{ opacity:categoryOpacity }} className="pointer-events-none absolute left-1/2 top-14 z-30 -translate-x-1/2 rounded-lg border-2 border-blue-500 px-3 py-1.5 text-xs font-black tracking-[.16em] text-blue-500">CATEGORY</motion.div>
      <motion.div style={{ opacity:trashOpacity }} className="pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-lg border-2 border-orange-500 px-3 py-1.5 text-xs font-black tracking-[.16em] text-orange-500">TRASH</motion.div>

      <div className="email-card-content flex h-full flex-col p-4 sm:p-6">
        <div className="flex items-start">
          <CompanyLogo senderName={email.senderName} senderEmail={email.senderEmail} companyName={email.companyName} size="md" />
          <div className="ml-3 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-[14px] font-bold text-slate-900 dark:text-white">{email.companyName}</p>
              {email.isUnread && <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />}
            </div>
            <p className="mt-0.5 truncate text-[11px] text-slate-400">{email.senderEmail}</p>
          </div>
          {email.category && <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">{email.category}</span>}
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-medium text-slate-400 sm:mt-6">
          <Clock3 className="h-3.5 w-3.5" />
          {dateLabel(email.receivedAt)}
        </div>
        <h3 className="mt-3 line-clamp-2 text-[18px] font-bold leading-[1.3] tracking-tight text-slate-950 dark:text-white sm:mt-4 sm:text-[22px]">{email.subject}</h3>
        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/50 sm:mt-5 sm:p-4">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-indigo-500">AI summary</p>
          <p className="text-[13px] leading-6 text-slate-600 dark:text-slate-300">{email.summary}</p>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex gap-1.5">
            {email.labels.slice(0,2).map((label) => <span key={label} className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">{label}</span>)}
          </div>
          <button type="button" onClick={(event) => { event.stopPropagation(); onOpen(email); }} className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
            Open email <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
