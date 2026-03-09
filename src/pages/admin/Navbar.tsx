import { Bell, Moon, MoreVertical, Search, Sun } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [headerSearch, setHeaderSearch] = useState("");
  return (
    <div>
           {/* Top navbar */}
           <header
          className={`shrink-0 flex items-center gap-4 px-6 py-4 border-b ${
            darkMode ? "border-white/5 bg-black/10" : "border-slate-200 bg-white/80"
          } backdrop-blur-sm`}
        >
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-400 transition" />
              <input
                type="text"
                placeholder="Search anything..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className={`w-full pl-11 pr-4 py-2 rounded border text-sm transition`}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded bg-white/5 p-1 gap-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => setDarkMode(false)}
                className={`p-2 rounded transition ${!darkMode ? "bg-amber-400/20 text-amber-400" : "text-slate-500 hover:text-slate-300"}`}
                title="Light mode"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDarkMode(true)}
                className={`p-2 rounded transition ${darkMode ? "bg-amber-400/20 text-amber-400" : "text-slate-500 hover:text-slate-300"}`}
                title="Dark mode"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              className={`relative p-2.5 rounded-2xl transition ${
                darkMode ? "hover:bg-white/5 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500"
              }`}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white/90" />
            </button>
            <div className="flex items-center gap-3 pl-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-orange-500/20 ring-2 ring-white/10">
                A
              </div>
              <div className="hidden sm:block">
                <div className="font-semibold text-white text-sm">Admin</div>
                <div className="text-[11px] text-slate-400">Welcome back</div>
              </div>
            </div>
            <button
              type="button"
              className={`p-2.5 rounded-2xl transition ${
                darkMode ? "hover:bg-white/5 text-slate-400" : "hover:bg-slate-100 text-slate-500"
              }`}
              title="More"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </header>
    </div>
  )
}

export default Navbar