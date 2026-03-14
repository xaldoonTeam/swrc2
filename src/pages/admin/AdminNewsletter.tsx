import { useEffect, useState } from "react";
import { api, assetUrl, type Newsletter } from "../../Api/client";
import AddNewsletterModal from "./AddNewsletterModal";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { adminClasses } from "../../lib/adminTheme";
import ConfirmDialog from "../../components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Mail,
  Search,
  Plus,
  Calendar,
  MoreVertical,
  Inbox,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

function fetchList(
  setList: (v: Newsletter[]) => void,
  setError: (v: string) => void
) {
  setError("");
  api<Newsletter[]>("/api/newsletters/admin/list")
    .then(setList)
    .catch((e) => setError(e instanceof Error ? e.message : "Failed to load newsletters"));
}

export default function AdminNewsletter() {
  const { darkMode } = useAdminTheme();
  const c = adminClasses(darkMode);
  const [list, setList] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
  const [deletingNewsletter, setDeletingNewsletter] = useState<Newsletter | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleTogglePublish = async (n: Newsletter) => {
    try {
      await api<unknown>(`/api/newsletters/${n.id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: !n.published }),
      });
      refreshList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const handleDelete = async () => {
    const n = deletingNewsletter;
    if (!n) return;
    setDeleteLoading(true);
    try {
      await api<unknown>(`/api/newsletters/${n.id}`, { method: "DELETE" });
      setDeletingNewsletter(null);
      refreshList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    api<Newsletter[]>("/api/newsletters/admin/list")
      .then(setList)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load newsletters"))
      .finally(() => setLoading(false));
  }, []);

  const refreshList = () => fetchList(setList, setError);

  const filtered = list.filter(
    (n) =>
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.summary && n.summary.toLowerCase().includes(search.toLowerCase()))
  );

  const formatDate = (s: string) => {
    try {
      return new Date(s).toLocaleDateString(undefined, { dateStyle: "medium" });
    } catch {
      return s;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
        <p className={c.loading}>Loading newsletters…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded p-6 ${c.error}`}>
        <p className="font-medium">Couldn't load newsletters</p>
        <p className="text-sm mt-1 opacity-90">{error}</p>
        <p className="text-sm mt-2 opacity-80">
          Make sure you're logged in and the backend server is running.
        </p>
        <button
          type="button"
          onClick={() => { setError(""); setLoading(true); api<Newsletter[]>("/api/newsletters/admin/list").then(setList).catch((e) => setError(e instanceof Error ? e.message : "Failed to load")).finally(() => setLoading(false)); }}
          className="mt-4 px-4 py-2 rounded bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`${c.page} space-y-6`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <Mail className="w-5 h-5" />
          </span>
          <div>
            <h1 className={`text-2xl font-bold ${c.title}`}>Newsletters</h1>
            <p className={`${c.subtitle} -mt-1 text-sm`}>
              Create and manage newsletters. Publish or unpublish to control visibility.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setEditingNewsletter(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          Add newsletter
        </button>
      </div>

      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${c.muted}`} />
        <input
          type="text"
          placeholder="Search by title or summary…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-12 pr-4 py-2 rounded border focus:outline-none focus:ring-2 transition ${c.input}`}
        />
      </div>

      {filtered.length === 0 ? (
        <div className={`rounded border border-dashed p-12 text-center ${c.emptyState}`}>
          <div className={`w-16 h-16 rounded flex items-center justify-center mx-auto mb-4 ${c.emptyIcon}`}>
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className={`text-lg font-semibold mb-1 ${c.emptyTitle}`}>
            {list.length === 0 ? "No newsletters yet" : "No matches"}
          </h3>
          <p className={`${c.emptySubtitle} text-sm max-w-sm mx-auto mb-6`}>
            {list.length === 0
              ? "Add your first newsletter. You can publish or unpublish anytime."
              : "Try a different search term."}
          </p>
          {list.length === 0 && (
            <button
              type="button"
              onClick={() => { setEditingNewsletter(null); setModalOpen(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              Add newsletter
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((n) => (
            <article
              key={n.id}
              className={`group rounded border transition overflow-hidden ${c.card}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                <div className="flex-shrink-0 w-14 h-14 rounded overflow-hidden bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20 transition">
                  {n.imageUrl ? (
                    <img src={assetUrl(n.imageUrl)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Mail className="w-7 h-7" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className={`font-semibold truncate ${c.title}`}>{n.title}</h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        n.published
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {n.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className={`flex flex-wrap items-center gap-3 text-sm ${c.muted}`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                  {n.summary && (
                    <p className={`text-sm mt-2 line-clamp-2 ${c.muted}`}>{n.summary}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={`p-2.5 rounded transition ${c.muted} ${darkMode ? "hover:text-white hover:bg-slate-700/50" : "hover:text-gray-900 hover:bg-slate-100"}`}
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[140px] rounded">
                      <DropdownMenuItem onSelect={() => { setEditingNewsletter(n); setModalOpen(true); }}>
                        <Pencil className="w-4 h-4 shrink-0" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleTogglePublish(n)}>
                        {n.published ? (
                          <>
                            <XCircle className="w-4 h-4 shrink-0" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem variant="destructive" onSelect={() => setDeletingNewsletter(n)}>
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

      <AddNewsletterModal
        isOpen={modalOpen}
        onClose={() => { setEditingNewsletter(null); setModalOpen(false); }}
        onSuccess={refreshList}
        newsletter={editingNewsletter}
      />

      <ConfirmDialog
        isOpen={!!deletingNewsletter}
        onClose={() => !deleteLoading && setDeletingNewsletter(null)}
        onConfirm={handleDelete}
        title="Delete newsletter"
        message={deletingNewsletter ? `Are you sure you want to delete "${deletingNewsletter.title}"? This action cannot be undone.` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
