import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { apiForm } from "../../Api/client";
import type { Publication } from "../../Api/client";

const TYPES = ["Annual Report", "Financial Report", "Evaluation Report", "Policy Brief", "Special Report", "Donor Report"];

interface PublicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** When provided, modal is in edit mode for this publication. Otherwise add mode. */
  publication?: Publication | null;
}

export default function PublicationModal({ isOpen, onClose, onSuccess, publication }: PublicationModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Report");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [pages, setPages] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [published, setPublished] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(publication?.id);

  useEffect(() => {
    if (publication) {
      setTitle(publication.title);
      setType(publication.type);
      setDescription(publication.description ?? "");
      setYear(publication.year.toString());
      setPages(publication.pages != null ? String(publication.pages) : "");
      setFileSize(publication.fileSize ?? "");
      setPublished(publication.published);
      setFile(null);
    } else {
      setTitle("");
      setType("Report");
      setDescription("");
      setYear(new Date().getFullYear().toString());
      setPages("");
      setFileSize("");
      setPublished(true);
      setFile(null);
    }
    setError("");
  }, [publication, isOpen]);

  const reset = () => {
    setTitle("");
    setType("Report");
    setDescription("");
    setYear(new Date().getFullYear().toString());
    setPages("");
    setFileSize("");
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
      form.append("type", type);
      form.append("description", description.trim());
      form.append("year", year);
      if (pages) form.append("pages", pages);
      if (fileSize) form.append("fileSize", fileSize);
      form.append("published", published ? "true" : "false");
      if (file) form.append("file", file);

      if (isEdit && publication?.id) {
        await apiForm<unknown>(`/api/publications/${publication.id}`, "PUT", form);
      } else {
        await apiForm<unknown>("/api/publications", "POST", form);
      }
      handleClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEdit ? "update" : "add"} publication`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center -mt-20 justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#252945] rounded border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">{isEdit ? "Edit publication" : "Add publication"}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="publication-form" onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
              placeholder="e.g. Annual Impact Report 2024"
              className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <option value="Report">Report</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of the publication"
              className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
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
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Pages</label>
              <input
                type="number"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="Optional"
                min="1"
                className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">File size</label>
            <input
              type="text"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              placeholder="e.g. 2.4 MB"
              className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">PDF file {isEdit && "(leave empty to keep current)"}</label>
            <label className="flex items-center gap-3 p-4 rounded border-2 border-dashed border-slate-600/50 hover:border-orange-500/50 cursor-pointer transition bg-slate-800/30">
              <Upload className="w-5 h-5 text-slate-400 shrink-0" />
              <span className="text-slate-400 text-sm truncate">
                {file ? file.name : publication?.fileUrl ? "Current file (choose new to replace)" : "Choose PDF to upload"}
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
            form="publication-form"
            disabled={loading}
            className="flex-1 px-4 py-2 rounded bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEdit ? "Updating…" : "Adding…"}
              </>
            ) : (
              isEdit ? "Update publication" : "Add publication"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
