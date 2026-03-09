import { useEffect, useState } from "react";
import { getMe, updateProfile } from "../../Api/client";
import type { AuthUser } from "../../Api/client";
import { Loader2, Save, User, Lock, Mail } from "lucide-react";

export default function AdminProfile() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    getMe()
      .then((u) => {
        setUser(u);
        setEmail(u.email ?? "");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if ((email !== user?.email || newPassword) && !currentPassword) {
      setError("Current password is required to make changes");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProfile({
        email: email.trim() || undefined,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      setUser(updated);
      setSuccess("Profile updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
        <p className="text-gray-400">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="text-gray-100 space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-10 h-10 rounded bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <User className="w-5 h-5" />
          </span>
          Profile
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Edit your email and password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/20 text-red-400 text-sm">{error}</div>
        )}
        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm">{success}</div>
        )}

        <div className="rounded bg-[#252945] border border-slate-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-400" />
              Email
            </h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@swrc.org"
              className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            />
          </div>
        </div>

        <div className="rounded bg-[#252945] border border-slate-700/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-400" />
              Change password
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">
              Leave blank to keep your current password
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Required to change email or password"
                className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-4 py-2.5 rounded bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
              />
            </div>
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
