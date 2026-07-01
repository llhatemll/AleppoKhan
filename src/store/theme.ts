import { create } from "zustand";

type ThemeState = {
  dark: boolean;
  toggle: () => void;
};

function getInitial(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const t = localStorage.getItem("theme");
    if (t) return t === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

export const useTheme = create<ThemeState>()((set, get) => ({
  dark: false,
  toggle: () => {
    const next = !get().dark;
    set({ dark: next });
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  },
}));

/* call once on client to sync store with DOM class */
export function initTheme() {
  const dark = getInitial();
  useTheme.setState({ dark });
}
