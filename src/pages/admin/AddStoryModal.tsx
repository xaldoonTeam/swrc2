import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { apiForm } from "../../Api/client";
import type { Story } from "../../Api/client";

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  story?: Story | null;
}

export default function AddStoryModal({ isOpen, onClose, onSuccess, story }: StoryModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("");
  const [storyText, setStoryText] = useState("");
  const [published, setPublished] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(story?.id);

  useEffect(() => {
    if (story) {
      setName(story.name);
      setRole(story.role ?? "");
      setCategory(story.category ?? "");
      setStoryText(story.story ?? "");
      setPublished(story.published);
      setImage(null);
    } else {
      setName("");
      setRole("");
      setCategory("");
      setStoryText("");
      setPublished(true);
      setImage(null);
    }
    setError("");
  }, [story, isOpen]);

  const reset = () => {
    setName("");
    setRole("");
    setCategory("");
    setStoryText("");
    setPublished(true);
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
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", name.trim());
      form.append("role", role.trim());
      form.append("category", category.trim());
      form.append("story", storyText.trim());
      form.append("published", published ? "true" : "false");
      if (image) form.append("image", image);

      if (isEdit && story?.id) {
        await apiForm<unknown>(`/api/stories/${story.id}`, "PUT", form);
      } else {
        await apiForm<unknown>("/api/stories", "POST", form);
      }
      handleClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEdit ? "update" : "add"} story`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#252945] rounded border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">{isEdit ? "Edit story" : "Add story"}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="story-form" onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded bg-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Jane Doe"
              className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Community Leader"
                className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Impact"
                className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Story</label>
            <textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              rows={4}
              placeholder="The story or testimonial…"
              className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Image {isEdit && "(leave empty to keep current)"}</label>
            <label className="flex items-center gap-3 p-4 rounded border-2 border-dashed border-slate-600/50 hover:border-orange-500/50 cursor-pointer transition bg-slate-800/30">
              <Upload className="w-5 h-5 text-slate-400 shrink-0" />
              <span className="text-slate-400 text-sm truncate">
                {image ? image.name : story?.imageUrl ? "Current image (choose new to replace)" : "Choose image to upload"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
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
            className="flex-1 px-4 py-2.5 rounded border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="story-form"
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEdit ? "Updating…" : "Adding…"}
              </>
            ) : (
              isEdit ? "Update story" : "Add story"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
