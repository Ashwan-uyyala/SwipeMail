import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Email, EmailFilter } from "../../types/email";

interface CustomFolder {
  id: string;
  name: string;
  color: string;
}

interface DashboardStatsProps {
  emails: Email[];
  selected: EmailFilter;
  onSelect: (filter: EmailFilter) => void;
}

const folderColors = ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#eab308"];

export function DashboardStats({ emails, selected, onSelect }: DashboardStatsProps) {
  const [folders, setFolders] = useState<CustomFolder[]>(() => {
    try {
      const saved = window.localStorage.getItem("swipemail-folders");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CustomFolder | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(folderColors[0]);

  useEffect(() => {
    window.localStorage.setItem("swipemail-folders", JSON.stringify(folders));
  }, [folders]);

  const builtIn = [
    { label:"All Mail", filter:"all" as const, count:emails.length },
    { label:"Unread", filter:"unread" as const, count:emails.filter((email) => email.isUnread).length },
    { label:"Important", filter:"important" as const, count:emails.filter((email) => email.isImportant).length },
  ];

  function openCreate() {
    setEditing(null);
    setName("");
    setColor(folderColors[0]);
    setModalOpen(true);
  }

  function openEdit(folder: CustomFolder) {
    setEditing(folder);
    setName(folder.name);
    setColor(folder.color);
    setModalOpen(true);
  }

  function saveFolder() {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (editing) {
      setFolders((current) => current.map((folder) => folder.id === editing.id ? { ...folder, name:trimmed, color } : folder));
      if (selected === `category:${editing.name}`) onSelect(`category:${trimmed}`);
    } else {
      setFolders((current) => [...current, {
        id:crypto.randomUUID?.() ?? `${Date.now()}`,
        name:trimmed,
        color,
      }]);
    }
    setModalOpen(false);
  }

  function deleteFolder(folder: CustomFolder) {
    setFolders((current) => current.filter((item) => item.id !== folder.id));
    if (selected === `category:${folder.name}`) onSelect("all");
    setModalOpen(false);
  }

  function folderCount(folderName: string) {
    const target = folderName.toLowerCase();
    return emails.filter((email) =>
      [email.category, ...email.labels].filter(Boolean).some((value) => value?.toLowerCase() === target),
    ).length;
  }

  return (
    <>
      <section className="folder-strip -mx-2x flex items-center gap-2 overflow-x-auto px-1 py-1 sm:mx-0 sm:px-0" aria-label="Email folders">
        {builtIn.map(({ label, filter, count }) => {
          const active = selected === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onSelect(filter)}
              className={`flex h-8 shrink-0 items-center gap-3 rounded-[30px] border px-3.5 text-[12px] font-semibold transition-colors ${
                active
                  ? "border-orange-500 bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                  : "border-black/10 bg-white/70 text-slate-600 hover:border-orange-300 hover:bg-orange-500/[0.06] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-orange-500/10"
              }`}
            >
              <span>{label}</span>
              <span className={`text-[10px] ${active ? "text-white/75" : "text-slate-400"}`}>{count}</span>
            </button>
          );
        })}

        {folders.map((folder) => {
          const active = selected === `category:${folder.name}`;
          const count = folderCount(folder.name);
          return (
            <div key={folder.id} className="relative">
              <button
                type="button"
                onClick={() => onSelect(`category:${folder.name}`)}
                className={`flex h-10 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-[12px] font-semibold transition-colors ${
                  active
                    ? "border-orange-500 bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                    : "border-black/10 bg-white/70 text-slate-600 hover:border-orange-300 hover:bg-orange-500/[0.06] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-orange-500/10"
                }`}
              >
                <span className="max-w-28 truncate">{folder.name}</span>
                <span className={`text-[10px] ${active ? "text-white/75" : "text-slate-400"}`}>{count}</span>
              </button>
              {active && (
                <button type="button" onClick={() => openEdit(folder)} aria-label={`Edit ${folder.name}`} className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full border border-white bg-slate-100 text-slate-500 shadow-sm hover:text-orange-500 dark:border-black dark:bg-black dark:text-slate-200">
                  <Pencil className="h-3 w-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={openCreate}
          className="flex h-8 w-10 shrink-0 items-center justify-center rounded-[30px] border border-dashed border-orange-500/50 bg-orange-500/[0.04] text-orange-500 transition-colors hover:border-orange-500 hover:bg-orange-500/10"
          aria-label="Create folder"
        >
          <Plus className="h-5 w-5" />
        </button>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0" onClick={() => setModalOpen(false)} aria-label="Close" />
          <div className="dark-panel relative w-full max-w-sm rounded-[20px] border border-black/10 bg-white p-5 shadow-2xl dark:border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">{editing ? "Edit folder" : "Create folder"}</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-black/5 dark:hover:bg-white/5"><X className="h-4 w-4" /></button>
            </div>
            <label className="mt-5 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Folder name</label>
            <input autoFocus value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") saveFolder(); }} placeholder="e.g. Finance" className="mt-2 h-11 w-full rounded-xl border border-black/10 bg-black/[0.025] px-3 text-sm outline-none focus:border-orange-500/60 focus:ring-4 focus:ring-orange-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white" />
            <div className="mt-4 flex items-center gap-2">
              {folderColors.map((option) => (
                <button key={option} type="button" onClick={() => setColor(option)} className={`h-7 w-7 rounded-lg border-2 transition ${color === option ? "scale-110 border-slate-900 dark:border-white" : "border-transparent"}`} style={{ backgroundColor:option }} aria-label={`Choose ${option}`} />
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2">
              {editing && <button type="button" onClick={() => deleteFolder(editing)} className="mr-auto flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-bold text-red-500 hover:bg-red-500/10"><Trash2 className="h-4 w-4" />Delete</button>}
              <button type="button" onClick={() => setModalOpen(false)} className="h-10 rounded-xl border border-black/10 px-4 text-xs font-bold text-slate-500 dark:border-white/10 dark:text-slate-300">Cancel</button>
              <button type="button" onClick={saveFolder} disabled={!name.trim()} className="h-10 rounded-xl bg-orange-500 px-4 text-xs font-bold text-white shadow-[0_8px_20px_-10px_rgba(249,115,22,.8)] disabled:opacity-40">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
