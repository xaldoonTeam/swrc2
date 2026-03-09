import { useEffect, useState } from "react";
import { api, type Program } from "../../Api/client";
import AddProgramModal from "./AddProgramModal";
import ConfirmDialog from "../../components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { getProgramIcon } from "../../lib/programIcons";
import {
  Search,
  Plus,
  MoreVertical,
  Loader2,
  Inbox,
  Pencil,
  Trash2,
  LayoutList,
} from "lucide-react";

function fetchList(setList: (v: Program[]) => void) {
  api<Program[]>("/api/programs/admin/list")
    .then(setList)
    .catch(() => {});
}

export default function AdminPrograms() {
  const [list, setList] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<Program | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    const p = deletingProgram;
    if (!p) return;
    setDeleteLoading(true);
    try {
      await api<unknown>(`/api/programs/${p.id}`, { method: "DELETE" });
      setDeletingProgram(null);
      refreshList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    api<Program[]>("/api/programs/admin/list")
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const refreshList = () => fetchList(setList);

  const filtered = list.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
        <p className="text-gray-400">Loading programs…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 text-red-400">
        <p className="font-medium">Couldn&apos;t load programs</p>
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
            <LayoutList className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-white">Programs</h1>
            <p className="text-gray-400 -mt-1 text-sm">
              Manage program descriptions and order.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setEditingProgram(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            Add program
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by title or description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-2 rounded bg-[#252945] border border-slate-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
        />
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="rounded bg-[#252945] border border-slate-700/50 border-dashed p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {list.length === 0 ? "No programs yet" : "No matches"}
          </h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
            {list.length === 0
              ? "Add your first program. Programs are displayed on the public site."
              : "Try a different search term."}
          </p>
          {list.length === 0 && (
            <button
              type="button"
              onClick={() => { setEditingProgram(null); setModalOpen(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              Add program
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const IconComponent = getProgramIcon(p.iconName);
            return (
              <article
                key={p.id}
                className="group rounded bg-[#252945] border border-slate-700/50 hover:border-orange-500/30 transition overflow-hidden flex flex-col"
              >
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-12 h-12 rounded bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20 transition shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="p-2 rounded text-gray-400 hover:text-white hover:bg-slate-700/50 transition shrink-0"
                          title="More options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-[140px] rounded">
                        <DropdownMenuItem onSelect={() => { setEditingProgram(p); setModalOpen(true); }} className="rounded">
                          <Pencil className="w-4 h-4 shrink-0" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeletingProgram(p)} className="rounded">
                          <Trash2 className="w-4 h-4 shrink-0" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h3 className="font-semibold text-white truncate mb-1">{p.title}</h3>
                  <span className="text-xs text-gray-500 mb-2">Order: {p.sortOrder}</span>
                  {p.description && (
                    <p className="text-gray-500 text-sm line-clamp-3 mt-auto">{p.description}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <AddProgramModal
        isOpen={modalOpen}
        onClose={() => { setEditingProgram(null); setModalOpen(false); }}
        onSuccess={refreshList}
        program={editingProgram}
      />

      <ConfirmDialog
        isOpen={!!deletingProgram}
        onClose={() => !deleteLoading && setDeletingProgram(null)}
        onConfirm={handleDelete}
        title="Delete program"
        message={deletingProgram ? `Are you sure you want to delete "${deletingProgram.title}"? This action cannot be undone.` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
