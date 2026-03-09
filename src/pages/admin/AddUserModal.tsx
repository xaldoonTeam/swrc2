import { useState, useEffect } from "react";
import { X, Loader2, Lock } from "lucide-react";
import { users, type AdminUser } from "../../Api/client";

const ROLES = [
  { value: "ADMIN", label: "Admin", desc: "Full access including user management" },
  { value: "EDITOR", label: "Editor", desc: "Manage content (publications, research, etc.)" },
];

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: AdminUser | null;
}

export default function AddUserModal({ isOpen, onClose, onSuccess, user }: AddUserModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "EDITOR">("EDITOR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(user?.id);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setPassword("");
      setRole((user.role === "ADMIN" ? "ADMIN" : "EDITOR") as "ADMIN" | "EDITOR");
    } else {
      setEmail("");
      setPassword("");
      setRole("EDITOR");
    }
    setError("");
  }, [user, isOpen]);

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setRole("EDITOR");
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!isEdit && (!password || password.length < 8)) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (isEdit && password && password.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      if (isEdit && user?.id) {
        await users.update(user.id, {
          email: email.trim(),
          role,
          ...(password ? { password } : {}),
        });
      } else {
        await users.create({
          email: email.trim(),
          password,
          role,
        });
      }
      handleClose();
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#252945] rounded border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-400" />
            {isEdit ? "Edit user" : "Create user"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form id="user-form" onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@swrc.org"
              className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {isEdit ? "New password (leave blank to keep current)" : "Password *"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEdit ? "Optional" : "At least 8 characters"}
              minLength={isEdit ? undefined : 8}
              className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
            <div className="space-y-2">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-start gap-3 p-4 rounded border cursor-pointer transition ${
                    role === r.value
                      ? "border-orange-500/50 bg-orange-500/10"
                      : "border-slate-600/50 hover:border-slate-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={() => setRole(r.value as "ADMIN" | "EDITOR")}
                    className="mt-1 w-4 h-4 text-orange-500 focus:ring-orange-500/50"
                  />
                  <div>
                    <div className="font-medium text-white">{r.label}</div>
                    <div className="text-sm text-slate-400">{r.desc}</div>
                  </div>
                </label>
              ))}
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
            form="user-form"
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEdit ? "Updating…" : "Creating…"}
              </>
            ) : (
              isEdit ? "Update user" : "Create user"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
