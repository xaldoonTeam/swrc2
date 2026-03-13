import { useMemo } from "react";
import { getCookie } from "../../lib/cookies";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  FileText,
  BarChart3,
  Briefcase,
  Heart,
  Video,
  Settings,
  LogOut,
  User,
  Users,
} from "lucide-react";
import AdminLogo from "../../components/admin/AdminLogo";
import { FaUser } from "react-icons/fa";

const baseNavItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/publications", label: "Publications", icon: FileText },
  { to: "/admin/research", label: "Research", icon: BarChart3 },
  { to: "/admin/programs", label: "Programs", icon: Briefcase },
  { to: "/admin/stories", label: "Stories", icon: Heart },
  { to: "/admin/media", label: "Media", icon: Video },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/profile", label: "Profile", icon: User },
];

interface AdminSidebarProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

export default function AdminSidebar({ darkMode, setDarkMode: _setDarkMode, search, onSearchChange }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useMemo(() => {
    try {
      const raw = getCookie("swrc_user");
      return raw ? (JSON.parse(raw) as { email?: string; role?: string }) : {};
    } catch {
      return {};
    }
  }, []);

  const navItems = useMemo(() => {
    const items = [...baseNavItems];
    if (user.role === "ADMIN") {
      items.push({ to: "/admin/users", label: "Users", icon: Users });
    }
    return items;
  }, [user.role]);

  const handleLogout = async () => {
    const { logout } = await import("../../Api/client");
    await logout().catch(() => {});
    navigate("/admin/login", { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;
  const sidebarBg = darkMode ? "bg-[#14172a]" : "bg-white border-r border-slate-200";
  const inputBg = darkMode
    ? "bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-white/10 focus:border-orange-500/50"
    : "bg-slate-100 border-slate-200 text-gray-900 placeholder-slate-400 focus:bg-white focus:border-orange-400";

  return (
    <aside
      className={`flex flex-col shrink-0 min-h-0 w-64 ${sidebarBg} rounded overflow-hidden shadow-2xl shadow-black/20`}
    >
      <div className="p-2 ">
        <Link
          to="/admin/dashboard"
          className={`block p-2 rounded active:scale-[0.98] transition ${darkMode ? "hover:bg-white/5" : "hover:bg-slate-100"}`}
        >
          <AdminLogo size="sm" showWordmark />
        </Link>
        <div className="mt-2">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-400 transition" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full pl-11 pr-4 py-2 text-sm border rounded transition ${inputBg}`}
            />
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 overflow-auto">
        <div className={`text-[10px] font-bold uppercase tracking-widest px-3 mb-3 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Menu</div>
        <div className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2 rounded transition-all duration-200 ${
                isActive(to)
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                  : darkMode
                    ? "text-slate-400 hover:bg-white/5 hover:text-white"
                    : "text-slate-600 hover:bg-gray-100"
              }`}
            >
              <span className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${isActive(to) ? "bg-white/20" : darkMode ? "bg-white/5" : "bg-slate-100"}`}>
                <Icon className="w-4 h-4" />
              </span>
              <span className="font-medium text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className={`p-2 border-t space-y-2 ${darkMode ? "border-white/5" : "border-slate-200"}`}>
        <div className={`flex items-center gap-2 p-1 rounded border min-w-0 ${darkMode ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-200"}`}>
          <Link to="/admin/profile" className="flex items-center gap-3 flex-1 min-w-0 rounded hover:opacity-90 transition">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-orange-500/20 ring-2 ring-white/10 shrink-0">
              <FaUser />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-semibold text-sm truncate ${darkMode ? "text-white" : "text-gray-900"}`}>Admin</div>
              <div className={`text-[11px] truncate ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{user.email ?? "admin@swrc.org"}</div>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={`p-2 rounded transition text-sm font-medium ${darkMode ? "text-slate-400 hover:bg-rose-500/10 hover:text-rose-400" : "text-slate-500 hover:bg-rose-50 hover:text-rose-600"}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
}
