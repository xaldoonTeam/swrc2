import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { apiForm } from "../../Api/client";
import type { Research } from "../../Api/client";

const CATEGORIES = ["Research", "Study", "Policy", "Report", "Case Study", "Other"];

interface ResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  research?: Research | null;
}

export default function AddResearchModal({ isOpen, onClose, onSuccess, research }: ResearchModalProps) {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [abstract, setAbstract] = useState("");
  const [methodology, setMethodology] = useState("");
  const [category, setCategory] = useState("Research");
  const [keywords, setKeywords] = useState("");
  const [published, setPublished] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(research?.id);

  useEffect(() => {
    if (research) {
      setTitle(research.title);
      setAuthors(research.authors ?? "");
      setYear(research.year.toString());
      setAbstract(research.abstract ?? "");
      setMethodology(research.methodology ?? "");
      setCategory(research.category ?? "Research");
      setKeywords(Array.isArray(research.keywords) ? research.keywords.join(", ") : "");
      setPublished(research.published);
      setFile(null);
    } else {
      setTitle("");
      setAuthors("");
      setYear(new Date().getFullYear().toString());
      setAbstract("");
      setMethodology("");
      setCategory("Research");
      setKeywords("");
      setPublished(true);
      setFile(null);
    }
    setError("");
  }, [research, isOpen]);

  const reset = () => {
    setTitle("");
    setAuthors("");
    setYear(new Date().getFullYear().toString());
    setAbstract("");
    setMethodology("");
    setCategory("Research");
    setKeywords("");
    setPublished(true);
    setFile(null);
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("authors", authors.trim());
      form.append("year", year);
      form.append("abstract", abstract.trim());
      form.append("methodology", methodology.trim());
      form.append("category", category);
      form.append("keywords", keywords.split(",").map((k) => k.trim()).filter(Boolean).join(","));
      form.append("published", published ? "true" : "false");
      if (file) form.append("file", file);

      if (isEdit && research?.id) {
        await apiForm<unknown>(`/api/research/${research.id}`, "PUT", form);
      } else {
        await apiForm<unknown>("/api/research", "POST", form);
      }
      handleClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEdit ? "update" : "add"} research`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#252945] rounded border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">{isEdit ? "Edit research" : "Add research"}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="research-form" onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded bg-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Research title"
              className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Authors</label>
            <input
              type="text"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              placeholder="e.g. Jane Doe, John Smith"
              className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2000"
                max="2030"
                className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Abstract</label>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              rows={3}
              placeholder="Brief abstract"
              className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Methodology</label>
            <textarea
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              rows={2}
              placeholder="Optional"
              className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Keywords (comma-separated)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. gender, policy, Somalia"
              className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">PDF file {isEdit && "(leave empty to keep current)"}</label>
            <label className="flex items-center gap-3 p-3 rounded border-2 border-dashed border-slate-600/50 hover:border-orange-500/50 cursor-pointer transition bg-slate-800/30">
              <Upload className="w-5 h-5 text-slate-400 shrink-0" />
              <span className="text-slate-400 text-sm truncate">
                {file ? file.name : research?.pdfUrl ? "Current file (choose new to replace)" : "Choose PDF to upload"}
              </span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-orange-500 focus:ring-orange-500/50"
            />
            <span className="text-sm text-slate-300">Publish immediately</span>
          </label>
        </form>

        <div className="flex gap-3 px-6 py-4 border-t border-slate-700/50 bg-slate-800/20">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 rounded border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="research-form"
            disabled={loading}
            className="flex-1 px-4 py-2 rounded bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEdit ? "Updating…" : "Adding…"}
              </>
            ) : (
              isEdit ? "Update research" : "Add research"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
