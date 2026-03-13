import { useEffect, useState } from "react";
import { api, assetUrl, type Story } from "../../Api/client";
import AddStoryModal from "./AddStoryModal";
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
  Search,
  Plus,
  MoreVertical,
  Loader2,
  Inbox,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  User,
  Eye,
  Image,
} from "lucide-react";

function fetchList(setList: (v: Story[]) => void) {
  api<Story[]>("/api/stories/admin/list")
    .then(setList)
    .catch(() => {});
}

export default function AdminStories() {
  const { darkMode } = useAdminTheme();
  const c = adminClasses(darkMode);
  const [list, setList] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [deletingStory, setDeletingStory] = useState<Story | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleTogglePublish = async (s: Story) => {
    try {
      await api<unknown>(`/api/stories/${s.id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: !s.published }),
      });
      refreshList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const handleDelete = async () => {
    const s = deletingStory;
    if (!s) return;
    setDeleteLoading(true);
    try {
      await api<unknown>(`/api/stories/${s.id}`, { method: "DELETE" });
      setDeletingStory(null);
      refreshList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    api<Story[]>("/api/stories/admin/list")
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const refreshList = () => fetchList(setList);

  const filtered = list.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      (s.story && s.story.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
        <p className={c.loading}>Loading stories…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-2xl p-6 ${c.error}`}>
        <p className="font-medium">Couldn&apos;t load stories</p>
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
            <User className="w-5 h-5" />
          </span>
          <div>
            <h1 className={`text-2xl font-bold ${c.title}`}>Stories</h1>
            <p className={`${c.subtitle} -mt-1 text-sm`}>
              Manage impact stories and testimonials.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setEditingStory(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            Add story
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${c.muted}`} />
        <input
          type="text"
          placeholder="Search by name, role or category…"
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
            {list.length === 0 ? "No stories yet" : "No matches"}
          </h3>
          <p className={`${c.emptySubtitle} text-sm max-w-sm mx-auto mb-6`}>
            {list.length === 0
              ? "Add your first impact story or testimonial. Images supported."
              : "Try a different search term."}
          </p>
          {list.length === 0 && (
            <button
              type="button"
              onClick={() => { setEditingStory(null); setModalOpen(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              Add story
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <article
              key={s.id}
              className={`group rounded border transition overflow-hidden flex flex-col ${c.card}`}
            >
              <div className={`relative aspect-[4/3] overflow-hidden ${darkMode ? "bg-slate-800/50" : "bg-slate-100"}`}>
                {s.imageUrl ? (
                  <img
                    src={assetUrl(s.imageUrl)}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${c.muted}`}>
                    <Image className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="p-2 rounded-lg bg-black/50 text-white/90 hover:bg-black/70 hover:text-white transition shrink-0"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[140px]">
                      {s.imageUrl ? (
                        <DropdownMenuItem asChild>
                          <a
                            href={assetUrl(s.imageUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4 shrink-0" />
                            View image
                          </a>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem disabled className="flex items-center gap-2">
                          <Eye className="w-4 h-4 shrink-0" />
                          View image
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onSelect={() => { setEditingStory(s); setModalOpen(true); }}>
                        <Pencil className="w-4 h-4 shrink-0" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleTogglePublish(s)}>
                        {s.published ? (
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
                      <DropdownMenuItem variant="destructive" onSelect={() => setDeletingStory(s)}>
                        <Trash2 className="w-4 h-4 shrink-0" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <span
                  className={`absolute top-2 left-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    s.published ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"
                  }`}
                >
                  {s.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className={`font-semibold truncate mb-0.5 ${c.title}`}>{s.name}</h3>
                <span className={`text-xs mb-2 ${c.muted}`}>{s.role} · {s.category}</span>
                {s.story && (
                  <p className={`text-sm line-clamp-3 mt-auto ${c.muted}`}>{s.story}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <AddStoryModal
        isOpen={modalOpen}
        onClose={() => { setEditingStory(null); setModalOpen(false); }}
        onSuccess={refreshList}
        story={editingStory}
      />

      <ConfirmDialog
        isOpen={!!deletingStory}
        onClose={() => !deleteLoading && setDeletingStory(null)}
        onConfirm={handleDelete}
        title="Delete story"
        message={deletingStory ? `Are you sure you want to delete the story from "${deletingStory.name}"? This cannot be undone.` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
