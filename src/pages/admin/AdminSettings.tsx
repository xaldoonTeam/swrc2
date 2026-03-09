import { useEffect, useState } from "react";
import { settings, type SiteSettings } from "../../Api/client";
import { Loader2, Save, FileText, Mail } from "lucide-react";

const LABELS: Record<string, string> = {
  about_hero: "About Us – Hero headline",
  about_swrc_text: "About Us – Main paragraph (About SWRC)",
  about_vision: "About Us – Our Vision",
  about_mission: "About Us – Our Mission",
  footer_mission: "Footer – Mission tagline",
  footer_address: "Footer – Address (use \\n for line breaks)",
  footer_phone: "Footer – Phone",
  footer_email: "Footer – Email",
};

export default function AdminSettings() {
  const [data, setData] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    settings.getAdmin().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await settings.update(data);
      setData(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
        <p className="text-gray-400">Loading settings…</p>
      </div>
    );
  }

  const aboutKeys = ["about_hero", "about_swrc_text", "about_vision", "about_mission"];
  const footerKeys = ["footer_mission", "footer_address", "footer_phone", "footer_email"];

  return (
    <div className="text-gray-100 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-10 h-10 rounded bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <FileText className="w-5 h-5" />
          </span>
          Settings
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Edit text shown on the About Us page and in the footer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-3 rounded bg-red-500/20 text-red-400 text-sm">{error}</div>
        )}

        {/* About Us */}
        <div className="rounded bg-[#252945] border border-slate-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" />
              About Us
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">
              Text shown on the About Us page
            </p>
          </div>
          <div className="p-6 space-y-4">
            {aboutKeys.map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {LABELS[key] ?? key}
                </label>
                <textarea
                  value={data[key as keyof SiteSettings] ?? ""}
                  onChange={(e) => handleChange(key as keyof SiteSettings, e.target.value)}
                  rows={key.includes("_text") || key.includes("vision") || key.includes("mission") ? 3 : 2}
                  className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="rounded bg-[#252945] border border-slate-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-400" />
              Footer
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">
              Text shown in the site footer
            </p>
          </div>
          <div className="p-6 space-y-4">
            {footerKeys.map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {LABELS[key] ?? key}
                </label>
                <textarea
                  value={data[key as keyof SiteSettings] ?? ""}
                  onChange={(e) => handleChange(key as keyof SiteSettings, e.target.value)}
                  rows={key === "footer_mission" || key === "footer_address" ? 2 : 1}
                  className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition shadow-lg shadow-orange-500/20"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
