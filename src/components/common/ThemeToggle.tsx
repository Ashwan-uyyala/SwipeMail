import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type PropsWithChildren,
} from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem("swipemail-theme");
    if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const themeRef = useRef<Theme>(theme);

  useEffect(() => {
    const root = document.documentElement;
    themeRef.current = theme;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    window.localStorage.setItem("swipemail-theme", theme);
  }, [theme]);

  function toggleTheme() {
    const nextTheme: Theme = themeRef.current === "light" ? "dark" : "light";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduceMotion && "startViewTransition" in document) {
      const transitionDocument = document as Document & {
        startViewTransition: (update: () => void) => { ready: Promise<void>; finished: Promise<void> };
      };
      const transition = transitionDocument.startViewTransition(() => {
        themeRef.current = nextTheme;
        setTheme(nextTheme);
      });
      transition.ready.catch(() => undefined);
      transition.finished.catch(() => undefined);
      return;
    }

    themeRef.current = nextTheme;
    setTheme(nextTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      className={`dark-panel relative flex h-10 w-[72px] items-center overflow-hidden rounded-full border p-1 shadow-sm transition-all duration-500 ${
        isDark
          ? "border-white/10"
          : "border-slate-200 bg-slate-100"
      }`}
    >
      <Sun
        className={`absolute left-[9px] h-4 w-4 transition-all duration-500 ${
          isDark ? "text-slate-500" : "text-amber-500"
        }`}
      />
      <Moon
        className={`absolute right-[9px] h-4 w-4 transition-all duration-500 ${
          isDark ? "text-blue-300" : "text-slate-400"
        }`}
      />
      <span
        style={{ transform: `translateX(${isDark ? 32 : 0}px)` }}
        className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full shadow-md ring-1 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark
            ? "bg-black text-orange-300 ring-white/10"
            : "bg-white text-amber-500 ring-slate-200/50"
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </span>
    </button>
  );
}
