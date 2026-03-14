import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNav from "./AdminNav";
import { AdminThemeContext, getStoredTheme, setStoredTheme } from "../../contexts/AdminThemeContext";

const routeTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/publications": "Publications",
  "/admin/newsletters": "Newsletters",
  "/admin/research": "Research",
  "/admin/programs": "Programs",
  "/admin/stories": "Stories",
  "/admin/media": "Media",
  "/admin/settings": "Settings",
};

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkModeState] = useState(getStoredTheme);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [headerSearch, setHeaderSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    setStoredTheme(darkMode);
  }, [darkMode]);

  const setDarkMode = useCallback((v: boolean) => setDarkModeState(v), []);
  const toggleTheme = useCallback(() => setDarkModeState((d: boolean) => !d), []);

  const title = routeTitles[location.pathname] ?? "Dashboard";
  const themeClass = darkMode ? "bg-[#1a1d2e] text-gray-100" : "bg-slate-50 text-gray-900";

  const themeValue = {
    darkMode,
    setDarkMode,
    toggleTheme,
  };

  return (
    <AdminThemeContext.Provider value={themeValue}>
      <div className={`h-screen max-h-screen overflow-hidden flex ${themeClass}`}>
        <div className="hidden md:flex md:w-64 shrink-0 min-h-0">
          <AdminSidebar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            search={sidebarSearch}
            onSearchChange={setSidebarSearch}
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          <AdminNav
            title={title}
            onToggleSidebar={() => setIsOpen(!isOpen)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            search={headerSearch}
            onSearchChange={setHeaderSearch}
          />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminThemeContext.Provider>
  );
}
