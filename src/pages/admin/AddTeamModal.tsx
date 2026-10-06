import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { apiForm, type Story } from "../../Api/client";
import { TEAM_CATEGORY, teamImage } from "../../content/team";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  member?: Story | null;
}

export default function AddTeamModal({ isOpen, onClose, onSuccess, member }: TeamModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [published, setPublished] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(member?.id);

  useEffect(() => {
    if (!isOpen) return;
    setName(member?.name ?? "");
    setRole(member?.role ?? "");
    setPublished(member?.published ?? false);
    setImage(null);
    setError("");
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("name", name.trim());
      form.append("role", role.trim());
      form.append("category", TEAM_CATEGORY);
      form.append("story", member?.story ?? "");
      form.append("published", published ? "true" : "false");
      if (image) form.append("image", image);
      if (isEdit && member?.id) {
        await apiForm(`/api/stories/${member.id}`, "PUT", form);
      } else {
        await apiForm("/api/stories", "POST", form);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save team member");
    } finally {
      setLoading(false);
    }
  };

  const preview = image ? URL.createObjectURL(image) : teamImage(member?.imageUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-lg bg-[#252945] border border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white">{isEdit ? "Edit team member" : "Register team member"}</h2>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 rounded bg-red-500/20 text-red-400 text-sm">{error}</div>}
          <label className="block">
            <span className="block text-sm text-slate-300 mb-1.5">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white"
              required
            />
          </label>
          <label className="block">
            <span className="block text-sm text-slate-300 mb-1.5">Role</span>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white"
            />
          </label>
          <div>
            <span className="block text-sm text-slate-300 mb-1.5">Photo</span>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 border border-slate-600/50 shrink-0">
                {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : null}
              </div>
              <label className="flex-1 flex items-center gap-2 p-3 rounded border border-dashed border-slate-600 text-slate-400 text-sm cursor-pointer">
                <Upload className="w-4 h-4" />
                {image ? image.name : "Choose photo"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
              </label>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Publish on the About page
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-slate-600 text-slate-300">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-orange-500 text-white font-medium disabled:opacity-50 inline-flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Save" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
