import { useEffect, useState } from "react";
import { api, assetUrl, type Publication } from "../../Api/client";
import AddPublicationModal from "./AddPublicationModal";
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
  FileText,
  Search,
  Plus,
  Calendar,
  Download,
  ExternalLink,
  MoreVertical,
  BookOpen,
  Loader2,
  Inbox,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function fetchList(setList: (v: Publication[]) => void) {
  api<Publication[]>("/api/publications/admin/list")
    .then(setList)
    .catch(() => {});
}

export default function AdminPublications() {
  const { darkMode } = useAdminTheme();
  const c = adminClasses(darkMode);
  const [list, setList] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [deletingPublication, setDeletingPublication] = useState<Publication | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleTogglePublish = async (p: Publication) => {
    try {
      await api<unknown>(`/api/publications/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: !p.published }),
      });
      refreshList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const handleDelete = async () => {
    const p = deletingPublication;
    if (!p) return;
    setDeleteLoading(true);
    try {
      await api<unknown>(`/api/publications/${p.id}`, { method: "DELETE" });
      setDeletingPublication(null);
      refreshList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    api<Publication[]>("/api/publications/admin/list")
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const refreshList = () => fetchList(setList);

  const filtered = list.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase())
  );
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
        <p className={c.loading}>Loading publications…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded p-6 ${c.error}`}>
        <p className="font-medium">Couldn’t load publications</p>
        <p className="text-sm mt-1 opacity-90">{error}</p>
      </div>
    );
  }

  return (
    <div className={`${c.page} space-y-6`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h1 className={`text-2xl font-bold ${c.title}`}>Publications</h1>
            <p className={`${c.subtitle} -mt-1 text-sm`}>
              Reports, policy briefs &amp; annual documents. Upload PDFs and manage visibility.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <span className="text-sm text-gray-400">
            <span className="font-semibold text-white">{publishedCount}</span> published
            <span className="text-gray-500 mx-1">·</span>
            <span className="font-semibold text-white">{list.length}</span> total
          </span> */}
          <button
            type="button"
            onClick={() => { setEditingPublication(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            Add publication
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${c.muted}`} />
        <input
          type="text"
          placeholder="Search by title or type…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-12 pr-4 py-2 rounded border focus:outline-none focus:ring-2 transition ${c.input}`}
        />
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className={`rounded border border-dashed p-12 text-center ${c.emptyState}`}>
          <div className={`w-16 h-16 rounded flex items-center justify-center mx-auto mb-4 ${c.emptyIcon}`}>
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className={`text-lg font-semibold mb-1 ${c.emptyTitle}`}>
            {list.length === 0 ? "No publications yet" : "No matches"}
          </h3>
          <p className={`${c.emptySubtitle} text-sm max-w-sm mx-auto mb-6`}>
            {list.length === 0
              ? "Add your first report or policy brief. PDF upload is supported."
              : "Try a different search term."}
          </p>
          {list.length === 0 && (
            <button
              type="button"
              onClick={() => { setEditingPublication(null); setModalOpen(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              Add publication
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((p) => (
            <article
              key={p.id}
              className={`group rounded border transition overflow-hidden ${c.card}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                <div className="flex-shrink-0 w-14 h-14 rounded bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20 transition">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className={`font-semibold truncate ${c.title}`}>{p.title}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.published
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className={`flex flex-wrap items-center gap-3 text-sm ${c.muted}`}>
                    <span className="flex items-center gap-1">
                      <span>Type</span>
                      {p.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {p.year}
                    </span>
                    {p.pages != null && (
                      <span>{p.pages} pages</span>
                    )}
                    {p.fileSize && (
                      <span>{p.fileSize}</span>
                    )}
                  </div>
                  {p.description && (
                    <p className={`text-sm mt-2 line-clamp-2 ${c.muted}`}>{p.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {p.fileUrl && (
                    <>
                      <a
                        href={assetUrl(p.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2.5 rounded-xl transition hover:text-orange-500 hover:bg-orange-500/10 ${c.muted}`}
                        title="Preview"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <a
                        href={assetUrl(p.fileUrl)}
                        download
                        className={`p-2.5 rounded-xl transition hover:text-orange-500 hover:bg-orange-500/10 ${c.muted}`}
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={`p-2.5 rounded-xl transition ${c.muted} ${darkMode ? "hover:text-white hover:bg-slate-700/50" : "hover:text-gray-900 hover:bg-slate-100"}`}
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[140px]">
                      {p.fileUrl ? (
                        <DropdownMenuItem asChild>
                          <a
                            href={assetUrl(p.fileUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4 shrink-0" />
                            View
                          </a>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem disabled className="flex items-center gap-2">
                          <Eye className="w-4 h-4 shrink-0" />
                          View
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onSelect={() => { setEditingPublication(p); setModalOpen(true); }}>
                        <Pencil className="w-4 h-4 shrink-0" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleTogglePublish(p)}>
                        {p.published ? (
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
                      <DropdownMenuItem variant="destructive" onSelect={() => setDeletingPublication(p)}>
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

      <AddPublicationModal
        isOpen={modalOpen}
        onClose={() => { setEditingPublication(null); setModalOpen(false); }}
        onSuccess={refreshList}
        publication={editingPublication}
      />

      <ConfirmDialog
        isOpen={!!deletingPublication}
        onClose={() => !deleteLoading && setDeletingPublication(null)}
        onConfirm={handleDelete}
        title="Delete publication"
        message={deletingPublication ? `Are you sure you want to delete "${deletingPublication.title}"? This action cannot be undone.` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
