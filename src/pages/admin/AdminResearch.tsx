import { useEffect, useState } from "react";
import { api, assetUrl, type Research } from "../../Api/client";
import AddResearchModal from "./AddResearchModal";
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
  Calendar,
  Download,
  ExternalLink,
  MoreVertical,
  Loader2,
  Inbox,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  BookOpen,
} from "lucide-react";

function fetchList(setList: (v: Research[]) => void) {
  api<Research[]>("/api/research/admin/list")
    .then(setList)
    .catch(() => {});
}

export default function AdminResearch() {
  const [list, setList] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResearch, setEditingResearch] = useState<Research | null>(null);
  const [deletingResearch, setDeletingResearch] = useState<Research | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleTogglePublish = async (r: Research) => {
    try {
      await api<unknown>(`/api/research/${r.id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: !r.published }),
      });
      refreshList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const handleDelete = async () => {
    const r = deletingResearch;
    if (!r) return;
    setDeleteLoading(true);
    try {
      await api<unknown>(`/api/research/${r.id}`, { method: "DELETE" });
      setDeletingResearch(null);
      refreshList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    api<Research[]>("/api/research/admin/list")
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const refreshList = () => fetchList(setList);

  const filtered = list.filter(
    (r) =>
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.authors.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
        <p className="text-gray-400">Loading research…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 text-red-400">
        <p className="font-medium">Couldn&apos;t load research</p>
        <p className="text-sm mt-1 opacity-90">{error}</p>
      </div>
    );
  }

  return (
    <div className="text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-white">Research</h1>
            <p className="text-gray-400 -mt-1 text-sm">
              Manage research projects, studies &amp; publications.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
          type="button"
          onClick={() => { setEditingResearch(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
            Add research
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by title, category or authors…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-2 rounded bg-[#252945] border border-slate-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
        />
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="rounded bg-[#252945] border border-slate-700/50 border-dashed p-12 text-center">
          <div className="w-16 h-16 rounded bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {list.length === 0 ? "No research yet" : "No matches"}
          </h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
            {list.length === 0
              ? "Add your first research project or study. PDF upload is supported."
              : "Try a different search term."}
          </p>
          {list.length === 0 && (
            <button
              type="button"
              onClick={() => { setEditingResearch(null); setModalOpen(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              Add research
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((r) => (
            <article
              key={r.id}
              className="group rounded bg-[#252945] border border-slate-700/50 hover:border-orange-500/30 transition overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                <div className="flex-shrink-0 w-14 h-14 rounded bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20 transition">
                  <BookOpen className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{r.title}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        r.published
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {r.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <span className="text-gray-500">Category</span>
                      {r.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {r.year}
                    </span>
                    {r.authors && (
                      <span className="text-gray-500 truncate max-w-[200px]">{r.authors}</span>
                    )}
                  </div>
                  {r.abstract && (
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{r.abstract}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {r.pdfUrl && (
                    <>
                      <a
                        href={assetUrl(r.pdfUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 transition"
                        title="Preview"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <a
                        href={assetUrl(r.pdfUrl)}
                        download
                        className="p-2.5 rounded-xl text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 transition"
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
                        className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-slate-700/50 transition"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[140px]">
                      {r.pdfUrl ? (
                        <DropdownMenuItem asChild>
                          <a
                            href={assetUrl(r.pdfUrl)}
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
                      <DropdownMenuItem onSelect={() => { setEditingResearch(r); setModalOpen(true); }}>
                        <Pencil className="w-4 h-4 shrink-0" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleTogglePublish(r)}>
                        {r.published ? (
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
                      <DropdownMenuItem variant="destructive" onSelect={() => setDeletingResearch(r)}>
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

      <AddResearchModal
        isOpen={modalOpen}
        onClose={() => { setEditingResearch(null); setModalOpen(false); }}
        onSuccess={refreshList}
        research={editingResearch}
      />

      <ConfirmDialog
        isOpen={!!deletingResearch}
        onClose={() => !deleteLoading && setDeletingResearch(null)}
        onConfirm={handleDelete}
        title="Delete research"
        message={deletingResearch ? `Are you sure you want to delete "${deletingResearch.title}"? This action cannot be undone.` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
