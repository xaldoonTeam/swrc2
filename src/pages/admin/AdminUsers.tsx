import { useEffect, useState } from "react";
import { getCookie } from "../../lib/cookies";
import { users, type AdminUser } from "../../Api/client";
import AddUserModal from "./AddUserModal";
import ConfirmDialog from "../../components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  Loader2,
  Inbox,
  Pencil,
  Trash2,
  Users,
  Shield,
  ShieldCheck,
} from "lucide-react";

function fetchList(setList: (v: AdminUser[]) => void) {
  users
    .list()
    .then(setList)
    .catch(() => {});
}

export default function AdminUsers() {
  const [list, setList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const currentUser = (() => {
    try {
      const raw = getCookie("swrc_user");
      return raw ? (JSON.parse(raw) as { id?: string }) : {};
    } catch {
      return {};
    }
  })();

  const handleDelete = async () => {
    const u = deletingUser;
    if (!u) return;
    setDeleteLoading(true);
    try {
      await users.delete(u.id);
      setDeletingUser(null);
      refreshList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    users
      .list()
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const refreshList = () => fetchList(setList);

  const filtered = list.filter(
    (u) =>
      !search ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
        <p className="text-gray-400">Loading users…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 text-red-400">
        <p className="font-medium">Couldn&apos;t load users</p>
        <p className="text-sm mt-1 opacity-90">{error}</p>
      </div>
    );
  }

  return (
    <div className="text-gray-100 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <Users className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-white">Users</h1>
            <p className="text-gray-400 -mt-1 text-sm">
              Manage accounts, roles and permissions.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setEditingUser(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            Create user
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by email or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-2 rounded bg-[#252945] border border-slate-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded bg-[#252945] border border-slate-700/50 border-dashed p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {list.length === 0 ? "No users yet" : "No matches"}
          </h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
            {list.length === 0
              ? "Create your first user. Only admins can access this page."
              : "Try a different search term."}
          </p>
          {list.length === 0 && (
            <button
              type="button"
              onClick={() => { setEditingUser(null); setModalOpen(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              Create user
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((u) => (
            <article
              key={u.id}
              className="rounded bg-[#252945] border border-slate-700/50 hover:border-orange-500/30 transition overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3">
                <div className="flex-shrink-0 w-12 h-12 rounded bg-orange-500/10 flex items-center justify-center text-orange-400">
                  {u.role === "ADMIN" ? (
                    <ShieldCheck className="w-6 h-6" />
                  ) : (
                    <Shield className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{u.email}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.role === "ADMIN" ? "bg-amber-500/20 text-amber-400" : "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {u.role}
                    </span>
                    {u.id === currentUser.id && (
                      <span className="text-xs text-slate-500">(you)</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Created {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-slate-700/50 transition"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[140px]">
                      <DropdownMenuItem onSelect={() => { setEditingUser(u); setModalOpen(true); }}>
                        <Pencil className="w-4 h-4 shrink-0" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => setDeletingUser(u)}
                        disabled={u.id === currentUser.id}
                      >
                        <Trash2 className="w-4 h-4 shrink-0" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AddUserModal
        isOpen={modalOpen}
        onClose={() => { setEditingUser(null); setModalOpen(false); }}
        onSuccess={refreshList}
        user={editingUser}
      />

      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => !deleteLoading && setDeletingUser(null)}
        onConfirm={handleDelete}
        title="Delete user"
        message={deletingUser ? `Are you sure you want to delete "${deletingUser.email}"? This cannot be undone.` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
