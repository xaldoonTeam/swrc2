import { Search, Bell, Sun, Moon } from "lucide-react";

interface AdminNavProps {
  title?: string;
  onToggleSidebar?: () => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

const inputBg = (darkMode: boolean) =>
  darkMode
    ? "bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-white/10 focus:border-orange-500/50"
    : "bg-slate-100 border-slate-200 text-gray-900 placeholder-slate-400 focus:bg-white focus:border-orange-400";

export default function AdminNav({ title = "Dashboard", onToggleSidebar, darkMode, setDarkMode, search, onSearchChange }: AdminNavProps) {
  return (
    <header
      className={`shrink-0 flex items-center justify-between gap-4 px-6 py-4 border-b ${
        darkMode ? "border-white/5 bg-black/10" : "border-slate-200 bg-white/80"
      } backdrop-blur-sm`}
    >
      {onToggleSidebar && (
        <button
          type="button"
          onClick={onToggleSidebar}
          className={`p-2 rounded-xl lg:hidden transition ${darkMode ? "hover:bg-white/5 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      <h1 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{title}</h1>
     
      <div className="flex items-center gap-2">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition ${darkMode ? "text-slate-500" : "text-slate-400"} group-focus-within:text-orange-400`} />
          <input
            type="text"
            placeholder="Search anything..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-11 pr-4 py-2.5 rounded border text-sm transition ${inputBg(darkMode)}`}
          />
        </div>
      </div>
        <div className={`flex rounded p-1 gap-0.5 border ${darkMode ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"}`}>
          <button
            type="button"
            onClick={() => setDarkMode(false)}
            className={`p-2 rounded transition ${!darkMode ? "bg-amber-400/20 text-amber-600" : "text-slate-500 hover:text-slate-300"}`}
            title="Light mode"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDarkMode(true)}
            className={`p-2 rounded transition ${darkMode ? "bg-amber-400/20 text-amber-400" : "text-slate-500 hover:text-slate-700"}`}
            title="Dark mode"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          className={`relative p-2.5 rounded transition ${darkMode ? "hover:bg-white/5 text-slate-400 hover:text-white" : "hover:bg-slate-200 text-slate-500 bg-slate-100"}`}
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white/90" />
        </button>
        {/* <div className="flex items-center gap-3 pl-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-orange-500/20 ring-2 ring-white/10">
            A
          </div>
          <div className="hidden sm:block">
            <div className="font-semibold text-white text-sm">Admin</div>
            <div className="text-[11px] text-slate-400">Welcome back</div>
          </div>
        </div> */}
        <button
          type="button"
          className={`p-2.5 rounded transition ${darkMode ? "hover:bg-white/5 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
          title="More"
        >
          {/* <MoreVertical className="w-5 h-5" /> */}
        </button>
      </div>
    </header>
  );
}
