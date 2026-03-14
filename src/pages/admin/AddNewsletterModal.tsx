import { useState, useEffect } from "react";
import { X, Loader2, Upload } from "lucide-react";
import { apiForm, assetUrl } from "../../Api/client";
import type { Newsletter } from "../../Api/client";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  newsletter?: Newsletter | null;
}

export default function AddNewsletterModal({ isOpen, onClose, onSuccess, newsletter }: NewsletterModalProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(newsletter?.id);

  useEffect(() => {
    if (newsletter) {
      setTitle(newsletter.title);
      setSummary(newsletter.summary ?? "");
      setContent(newsletter.content ?? "");
      setPublished(newsletter.published);
      setImage(null);
    } else {
      setTitle("");
      setSummary("");
      setContent("");
      setPublished(false);
      setImage(null);
    }
    setError("");
  }, [newsletter, isOpen]);

  const reset = () => {
    setTitle("");
    setSummary("");
    setContent("");
    setPublished(false);
    setImage(null);
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
      form.append("summary", summary.trim());
      form.append("content", content.trim());
      form.append("published", published ? "true" : "false");
      if (image) form.append("image", image);

      if (isEdit && newsletter?.id) {
        await apiForm<unknown>(`/api/newsletters/${newsletter.id}`, "PUT", form);
      } else {
        await apiForm<unknown>("/api/newsletters", "POST", form);
      }
      handleClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEdit ? "update" : "add"} newsletter`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center -mt-20 justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#252945] rounded border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">{isEdit ? "Edit newsletter" : "Add newsletter"}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="newsletter-form" onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
              placeholder="e.g. March 2024 Newsletter"
              className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Image (optional)</label>
            <label className="flex items-center gap-3 p-4 rounded border-2 border-dashed border-slate-600/50 hover:border-orange-500/50 cursor-pointer transition bg-slate-800/30">
              <Upload className="w-5 h-5 text-slate-400 shrink-0" />
              <span className="text-slate-400 text-sm truncate">
                {image ? image.name : newsletter?.imageUrl ? "Current image (choose new to replace)" : "Choose image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
            {newsletter?.imageUrl && !image && (
              <img
                src={assetUrl(newsletter.imageUrl)}
                alt="Current"
                className="mt-2 h-20 w-auto rounded object-cover border border-slate-600/50"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              placeholder="Short summary (optional)"
              className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Newsletter content..."
              className="w-full px-4 py-2 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
            />
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
            form="newsletter-form"
            disabled={loading}
            className="flex-1 px-4 py-2 rounded bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEdit ? "Updating…" : "Adding…"}
              </>
            ) : (
              isEdit ? "Update newsletter" : "Add newsletter"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
