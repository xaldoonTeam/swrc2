import { useEffect, useState } from "react";
import { getCookie } from "../../lib/cookies";
import { Link } from "react-router-dom";
import {
  FileText,
  BarChart3,
  Briefcase,
  Heart,
  Video,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Loader2,
} from "lucide-react";
import { api } from "../../Api/client";

const contentSections = [
  { key: "publications", label: "Publications", to: "/admin/publications", icon: FileText, color: "from-amber-500/20 to-orange-500/20 text-amber-400" },
  { key: "research", label: "Research", to: "/admin/research", icon: BarChart3, color: "from-blue-500/20 to-indigo-500/20 text-blue-400" },
  { key: "programs", label: "Programs", to: "/admin/programs", icon: Briefcase, color: "from-emerald-500/20 to-teal-500/20 text-emerald-400" },
  { key: "stories", label: "Stories", to: "/admin/stories", icon: Heart, color: "from-rose-500/20 to-pink-500/20 text-rose-400" },
  { key: "media", label: "Media", to: "/admin/media", icon: Video, color: "from-violet-500/20 to-purple-500/20 text-violet-400" },
];

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({
    publications: 0,
    research: 0,
    programs: 0,
    stories: 0,
    media: 0,
  });
  const [loading, setLoading] = useState(true);
  const userCookie = getCookie("swrc_user");

  useEffect(() => {
    if (!userCookie) {
      setLoading(false);
      return;
    }
    const endpoints: { key: string; path: string }[] = [
      { key: "publications", path: "/api/publications/admin/list" },
      { key: "research", path: "/api/research/admin/list" },
      { key: "programs", path: "/api/programs/admin/list" },
      { key: "stories", path: "/api/stories/admin/list" },
      { key: "media", path: "/api/media/admin/list" },
    ];
    Promise.all(
      endpoints.map(({ key, path }) =>
        api<unknown[]>(path)
          .then((arr) => ({ key, count: arr.length }))
          .catch(() => ({ key, count: 0 }))
      )
    ).then((results) => {
      const next: Record<string, number> = {};
      results.forEach(({ key, count }) => {
        next[key] = count;
      });
      setCounts(next);
      setLoading(false);
    });
  }, [userCookie]);

  const maxCount = Math.max(...Object.values(counts), 1);
  const totalItems = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="text-gray-100 space-y-8">
      {/* Welcome block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-white">Content Dashboard</span>
            <Sparkles className="w-6 h-6 text-amber-400/80" />
          </div>
          <p className="text-slate-400">
            Hi there! Here’s a quick overview of your content.
          </p>
        </div>
        {!loading && totalItems > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/40 border border-slate-600/40 text-slate-300 text-sm">
            <span className="font-semibold text-white">{totalItems}</span> items total
          </div>
        )}
      </div>

      {/* Metric cards - adorable colored icons, soft shadows */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Quick access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {contentSections.map(({ key, label, to, icon: Icon, color }) => (
            <Link
              key={key}
              to={to}
              className="group relative bg-[#252945] hover:bg-[#2a2f4a] rounded p-5 border border-slate-700/50 hover:border-orange-500/30 transition-all duration-200 shadow-lg shadow-black/5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded bg-gradient-to-br ${color} flex items-center justify-center shadow-inner`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-orange-400 group-hover:translate-x-0.5 transition" />
              </div>
              <div className="text-3xl font-bold text-white mb-1 tabular-nums">
                {loading ? <Loader2 className="w-7 h-7 animate-spin text-slate-500" /> : (counts[key] ?? 0)}
              </div>
              <div className="text-sm text-slate-400 mb-2">{label}</div>
              <span className="text-xs font-medium text-orange-400 group-hover:text-orange-300">Manage →</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Content Analytics - soft card */}
      <section className="bg-[#252945] rounded border border-slate-700/50 p-6 shadow-lg shadow-black/5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded bg-orange-500/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Content Analytics</h2>
        </div>
        <p className="text-slate-400 text-sm mb-6">Distribution across content types</p>
        <div className="space-y-4">
          {contentSections.map(({ key, label, icon: Icon, color }) => {
            const count = counts[key] ?? 0;
            const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
            return (
              <div key={key} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-36 shrink-0">
                  <div className={`w-8 h-8 rounded bg-gradient-to-br ${color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-slate-300">{label}</span>
                </div>
                <div className="flex-1 h-2.5 bg-slate-700/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded transition-all duration-700 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-14 text-right text-sm text-slate-400 tabular-nums">
                  {loading ? "—" : `${count}`}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
