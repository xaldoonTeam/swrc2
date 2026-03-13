/** Shared class names for admin UI in light/dark mode */
export function adminClasses(darkMode: boolean) {
  return {
    page: darkMode ? "text-gray-100" : "text-gray-900",
    card: darkMode
      ? "bg-[#252945] border-slate-700/50 hover:border-orange-500/30"
      : "bg-white border-slate-200 hover:border-orange-400/50",
    cardMuted: darkMode ? "bg-[#252945] border-slate-700/50" : "bg-white border-slate-200",
    title: darkMode ? "text-white" : "text-gray-900",
    subtitle: darkMode ? "text-slate-400" : "text-slate-500",
    muted: darkMode ? "text-slate-400" : "text-slate-500",
    input: darkMode
      ? "bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-500 focus:ring-orange-500/50 focus:border-orange-500/50"
      : "bg-slate-50 border-slate-200 text-gray-900 placeholder-slate-400 focus:ring-orange-400 focus:border-orange-400",
    emptyState: darkMode
      ? "bg-[#252945] border-slate-700/50 border-dashed"
      : "bg-white border-slate-200 border-dashed",
    emptyIcon: darkMode ? "bg-slate-700/50 text-gray-500" : "bg-slate-100 text-slate-400",
    emptyTitle: darkMode ? "text-white" : "text-gray-900",
    emptySubtitle: darkMode ? "text-slate-400" : "text-slate-500",
    btnPrimary: "bg-orange-500 text-white hover:bg-orange-600",
    btnSecondary: darkMode
      ? "border-slate-600 text-slate-300 hover:bg-slate-700/50"
      : "border-slate-300 text-slate-600 hover:bg-slate-100",
    dropdown: darkMode ? "bg-slate-800 border-slate-600/50" : "bg-white border-slate-200",
    dropdownItem: darkMode ? "text-slate-200 hover:bg-slate-700/50" : "text-gray-700 hover:bg-slate-100",
    badge: darkMode ? "bg-slate-700/50 text-slate-400" : "bg-slate-100 text-slate-600",
    loading: darkMode ? "text-gray-400" : "text-slate-500",
    error: "bg-red-500/10 border-red-500/30 text-red-400",
  };
}
