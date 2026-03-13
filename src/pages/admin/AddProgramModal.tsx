import { useState, useEffect } from "react";
import { X, Loader2, Upload } from "lucide-react";
import { apiForm, assetUrl } from "../../Api/client";
import type { Program } from "../../Api/client";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { adminClasses } from "../../lib/adminTheme";

const ICONS = ["Users", "GraduationCap", "Lightbulb", "Briefcase", "HeartHandshake", "Rocket"];
const MAX_IMAGES = 10;

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  program?: Program | null;
}

export default function AddProgramModal({ isOpen, onClose, onSuccess, program }: ProgramModalProps) {
  const { darkMode } = useAdminTheme();
  const c = adminClasses(darkMode);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("Users");
  const [sortOrder, setSortOrder] = useState("0");
  const [images, setImages] = useState<File[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(program?.id);
  const totalCount = existingUrls.length + images.length;
  const canAddMore = totalCount < MAX_IMAGES;

  useEffect(() => {
    if (program) {
      setTitle(program.title);
      setDescription(program.description ?? "");
      setIconName(program.iconName ?? "Users");
      setSortOrder(String(program.sortOrder ?? 0));
      setExistingUrls(program.imageUrls ?? []);
    } else {
      setTitle("");
      setDescription("");
      setIconName("Users");
      setSortOrder("0");
      setExistingUrls([]);
    }
    setImages([]);
    setError("");
  }, [program, isOpen]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setIconName("Users");
    setSortOrder("0");
    setImages([]);
    setExistingUrls([]);
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const removeExisting = (index: number) => {
    setExistingUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNew = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const remaining = MAX_IMAGES - existingUrls.length - images.length;
    const toAdd = files.slice(0, remaining);
    setImages((prev) => [...prev, ...toAdd].slice(0, MAX_IMAGES - existingUrls.length));
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (totalCount > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", title.trim());
      form.append("description", description.trim());
      form.append("iconName", iconName || "");
      form.append("sortOrder", String(parseInt(sortOrder, 10) || 0));
      if (isEdit) {
        form.append("existingImageUrls", JSON.stringify(existingUrls));
      }
      images.forEach((file) => form.append("images", file));

      if (isEdit && program?.id) {
        await apiForm<unknown>(`/api/programs/${program.id}`, "PUT", form);
      } else {
        await apiForm<unknown>("/api/programs", "POST", form);
      }
      handleClose();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEdit ? "update" : "add"} program`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-lg rounded border shadow-2xl overflow-hidden ${c.cardMuted}`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? "border-slate-700/50" : "border-slate-200"}`}>
          <h2 className={`text-lg font-bold ${c.title}`}>{isEdit ? "Edit program" : "Add program"}</h2>
          <button
            type="button"
            onClick={handleClose}
            className={`p-2 rounded-xl transition ${c.muted} ${darkMode ? "hover:text-white hover:bg-slate-700/50" : "hover:text-gray-900 hover:bg-slate-100"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="program-form" onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Women in Leadership"
              className={`w-full px-4 py-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${c.input}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Brief description of the program"
              className={`w-full px-4 py-2.5 rounded border focus:outline-none focus:ring-2 resize-none ${c.input}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              Images (up to {MAX_IMAGES}) {isEdit && "(leave as is or add/remove)"}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {existingUrls.map((url, i) => (
                <div key={url} className="relative group">
                  <img
                    src={assetUrl(url)}
                    alt=""
                    className="w-14 h-14 rounded object-cover border border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeExisting(i)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.map((file, i) => (
                <div key={`${file.name}-${i}`} className="relative group">
                  <div className="w-14 h-14 rounded bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-400 text-xs truncate px-1">
                    {file.name}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNew(i)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            {canAddMore && (
              <label className={`flex items-center gap-2 px-4 py-2.5 rounded border border-dashed cursor-pointer transition w-full ${c.input} hover:border-orange-500/50`}>
                <Upload className="w-5 h-5 shrink-0" />
                <span className="text-sm">
                  {totalCount === 0
                    ? `Choose images to upload (max ${MAX_IMAGES})`
                    : `Add more (${totalCount}/${MAX_IMAGES})`}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={onFileChange}
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Icon</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className={`w-full px-4 py-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${c.input}`}
              >
                {ICONS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Order</label>
              <input
                type="text"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                min="0"
                className={`w-full px-4 py-2.5 rounded border focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${c.input}`}
              />
            </div>
          </div>
        </form>

        <div className={`flex gap-3 px-6 py-4 border-t ${darkMode ? "border-slate-700/50 bg-slate-800/20" : "border-slate-200 bg-slate-50"}`}>
          <button
            type="button"
            onClick={handleClose}
            className={`flex-1 px-4 py-2.5 rounded border transition ${c.btnSecondary}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="program-form"
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEdit ? "Updating…" : "Adding…"}
              </>
            ) : (
              isEdit ? "Update program" : "Add program"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
