import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { apiForm } from "../../Api/client";
import type { MediaItem } from "../../Api/client";

const TYPES = ["Documentary", "Interview", "Photo", "Video", "Report", "Other"];
const MEDIA_TYPES = ["video", "photo"];

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  media?: MediaItem | null;
}

export default function AddMediaModal({ isOpen, onClose, onSuccess, media }: AddMediaModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Video");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [views, setViews] = useState("0");
  const [date, setDate] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [mediaType, setMediaType] = useState("video");
  const [sortOrder, setSortOrder] = useState("0");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(media?.id);

  useEffect(() => {
    if (media) {
      setTitle(media.title);
      setType(media.type);
      setDescription(media.description ?? "");
      setDuration(media.duration ?? "");
      setViews(String(media.views ?? 0));
      setDate(media.date ?? "");
      setYoutubeId(media.youtubeId ?? "");
      setMediaType(media.mediaType ?? "video");
      setSortOrder(String(media.sortOrder ?? 0));
      setThumbnail(null);
    } else {
      setTitle("");
      setType("Video");
      setDescription("");
      setDuration("");
      setViews("0");
      setDate("");
      setYoutubeId("");
      setMediaType("video");
      setSortOrder("0");
      setThumbnail(null);
    }
    setError("");
  }, [media, isOpen]);

  const reset = () => {
    setTitle("");
    setType("Video");
    setDescription("");
    setDuration("");
    setViews("0");
    setDate("");
    setYoutubeId("");
    setMediaType("video");
    setSortOrder("0");
    setThumbnail(null);
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
      form.append("duration", duration.trim());
      form.append("views", views);
      form.append("date", date.trim());
      form.append("youtubeId", youtubeId.trim());
      form.append("mediaType", mediaType);
      form.append("sortOrder", sortOrder);
      if (thumbnail) form.append("thumbnail", thumbnail);

      if (isEdit && media?.id) {
        await apiForm<unknown>(`/api/media/${media.id}`, "PUT", form);
      } else {
        await apiForm<unknown>("/api/media", "POST", form);
      }
      handleClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEdit ? "update" : "add"} media`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#252945] rounded border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">{isEdit ? "Edit media" : "Add media"}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="media-form" onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Annual Documentary 2024"
              className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Media type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                {MEDIA_TYPES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">YouTube ID</label>
            <input
              type="text"
              value={youtubeId}
              onChange={(e) => setYoutubeId(e.target.value)}
              placeholder="e.g. dQw4w9WgXcQ (optional)"
              className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 25:30"
                className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Views</label>
              <input
                type="number"
                value={views}
                onChange={(e) => setViews(e.target.value)}
                min="0"
                className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. March 2024"
                className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Sort order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              min="0"
              className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Optional"
              className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Thumbnail {isEdit && "(leave empty to keep current)"}</label>
            <label className="flex items-center gap-3 p-4 rounded border-2 border-dashed border-slate-600/50 hover:border-orange-500/50 cursor-pointer transition bg-slate-800/30">
              <Upload className="w-5 h-5 text-slate-400 shrink-0" />
              <span className="text-slate-400 text-sm truncate">
                {thumbnail ? thumbnail.name : media?.thumbnailUrl ? "Current image (choose new to replace)" : "Choose image to upload"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
          </div>
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
            form="media-form"
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEdit ? "Updating…" : "Adding…"}
              </>
            ) : (
              isEdit ? "Update media" : "Add media"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
