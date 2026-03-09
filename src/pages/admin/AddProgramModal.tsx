import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { api } from "../../Api/client";
import type { Program } from "../../Api/client";

const ICONS = ["Users", "GraduationCap", "Lightbulb", "Briefcase", "HeartHandshake", "Rocket"];

interface ProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  program?: Program | null;
}

export default function AddProgramModal({ isOpen, onClose, onSuccess, program }: ProgramModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("Users");
  const [sortOrder, setSortOrder] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(program?.id);

  useEffect(() => {
    if (program) {
      setTitle(program.title);
      setDescription(program.description ?? "");
      setIconName(program.iconName ?? "Users");
      setSortOrder(String(program.sortOrder ?? 0));
    } else {
      setTitle("");
      setDescription("");
      setIconName("Users");
      setSortOrder("0");
    }
    setError("");
  }, [program, isOpen]);

  const reset = () => {
    setTitle("");
    setDescription("");
    setIconName("Users");
    setSortOrder("0");
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
      const body = {
        title: title.trim(),
        description: description.trim(),
        iconName: iconName || null,
        sortOrder: parseInt(sortOrder, 10) || 0,
      };
      if (isEdit && program?.id) {
        await api<unknown>(`/api/programs/${program.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        await api<unknown>("/api/programs", {
          method: "POST",
          body: JSON.stringify(body),
        });
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
      <div className="w-full max-w-lg bg-[#252945] rounded border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">{isEdit ? "Edit program" : "Add program"}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="program-form" onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
              placeholder="e.g. Women in Leadership"
              className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Brief description of the program"
              className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Icon</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                {ICONS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Order</label>
              <input
                type="text"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                min="0"
                className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
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
